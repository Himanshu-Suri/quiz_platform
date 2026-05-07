<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    <servlet>
        <servlet-name>ReportServlet</servlet-name>
        <servlet-class>com.quizplatform.servlet.ReportServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ReportServlet</servlet-name>
        <url-pattern>/report</url-pattern>
    </servlet-mapping>
</web-app>