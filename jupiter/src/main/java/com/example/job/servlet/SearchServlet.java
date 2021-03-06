package com.example.job.servlet;

import com.example.job.db.MySQLConnection;
import com.example.job.entity.Item;
import com.example.job.entity.ResultResponse;
import com.example.job.external.GitHubClient;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@WebServlet(name = "SearchServlet",urlPatterns = {"/search"})

public class SearchServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        HttpSession session = request.getSession(false);
        if (session == null) {
            response.setStatus(403);
            mapper.writeValue(response.getWriter(), new ResultResponse("Session Invalid"));
            return;
        }


        String userId = request.getParameter("user_id");
        double lat = Double.parseDouble(request.getParameter("lat"));
        double lon = Double.parseDouble(request.getParameter("lon"));

        MySQLConnection connection = new MySQLConnection();
        Set<String> favoritedItemIds = connection.getFavoriteItemIds(userId);
        connection.close();

        GitHubClient client = new GitHubClient();
        //String itemString = client.search(lat,lon,null);
        response.setContentType("application/json");
        //response.getWriter().print(itemString);
        List<Item> items = client.search(lat,lon,null);

        for(Item item: items)
        {
            item.setFavorite(favoritedItemIds.contains(item.getId()));
        }


        //ObjectMapper mapper = new ObjectMapper();
        //response.getWriter().print(mapper.writeValueAsString(items));

        mapper.writeValue(response.getWriter(),items);
    }
}
