package com.quizplatform;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;
import com.quizplatform.servlet.ReportServlet;
import java.io.File;

public class Main {
    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(8082);
        tomcat.getConnector();

        String webappDir = new File("src/main/webapp").getAbsolutePath();
        System.out.println("Serving webapp from: " + webappDir);

        // Use addContext instead of addWebapp to avoid reading web.xml
        Context ctx = tomcat.addContext("", webappDir);
        ctx.setParentClassLoader(Thread.currentThread().getContextClassLoader());

        // Manually register servlet
        Tomcat.addServlet(ctx, "ReportServlet", new ReportServlet());
        ctx.addServletMappingDecoded("/report", "ReportServlet");

        tomcat.start();
        System.out.println("JSP Report server running on http://localhost:8082");
        tomcat.getServer().await();
    }
}