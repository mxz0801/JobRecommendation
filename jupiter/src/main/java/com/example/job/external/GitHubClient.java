package com.example.job.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.job.entity.Item;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

public class GitHubClient {
    private static final String URL_TEMPLATE = "https://jobs.github.com/positions.json?description=%s&lat=%s&long=%s";
    private static final String DEFAULT_KEYWORD = "developer";

    public List<Item> search(double lat, double lon, String keyword)
    {
        if(keyword == null)
        {
            keyword=DEFAULT_KEYWORD;
        }


        try {
            keyword = URLEncoder.encode(keyword,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        String url = String.format(URL_TEMPLATE,keyword,lat,lon);

        CloseableHttpClient httpClient = HttpClients.createDefault();  //create client to make request from other server using API

        ResponseHandler<List<Item>> responseHandler = new ResponseHandler<List<Item>>() {
            @Override
            public List<Item> handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
                if (response.getStatusLine().getStatusCode() != 200) {
                    //return "";
                    return Collections.emptyList();
                }
                HttpEntity entity = response.getEntity();
                if (entity == null) {
                    //return "";
                    return Collections.emptyList();
                }
                //return EntityUtils.toString(entity);
                ObjectMapper mapper = new ObjectMapper();
                //Item[] itemArray = mapper.readValue(entity.getContent(), Item[].class);
                //return Arrays.asList(itemArray);
                List<Item> items = Arrays.asList(mapper.readValue(entity.getContent(), Item[].class));
                if(items.size()>5)
                {
                    items = items.subList(0,5);
                }
                GitHubClient.this.extractKeywords(items);
                return items;
            }
        };
        try {
            return httpClient.execute(new HttpGet(url), responseHandler);
        } catch (IOException e) {
            e.printStackTrace();
        }
        //return "";
        return Collections.emptyList();

    }

    private void extractKeywords(List<Item> items)
    {
        MonkeyLearnClient monkeyLearnClient = new MonkeyLearnClient();

        List<String> desStrings = new ArrayList<>();
        for(Item item : items)
        {
            desStrings.add(item.getDescription());
        }

        List<String> titles = new ArrayList<>();
        for(Item item : items)
        {
            titles.add(item.getTitle());
        }
        List<Set<String>> keywordList = monkeyLearnClient.extract(desStrings);
        if(keywordList.isEmpty())
        {
            keywordList = monkeyLearnClient.extract(titles);
        }
        for(int i=0;i<items.size();i++)
        {
            items.get(i).setKeywords(keywordList.get(i));
        }

    }
}
