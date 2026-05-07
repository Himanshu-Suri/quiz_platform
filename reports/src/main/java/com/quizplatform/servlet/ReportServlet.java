package com.quizplatform.servlet;

import com.mongodb.client.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class ReportServlet extends HttpServlet {
    private static final String MONGO_URI = "mongodb://localhost:27017";
    private static final String DB_NAME = "quizplatform";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String quizId = request.getParameter("quizId");

        List<Document> results = new ArrayList<>();
        String quizTitle = "Unknown Quiz";

        try (MongoClient mongoClient = MongoClients.create(MONGO_URI)) {
            MongoDatabase db = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> attempts = db.getCollection("attempts");
            MongoCollection<Document> quizzes  = db.getCollection("quizzes");
            MongoCollection<Document> users    = db.getCollection("users");

            if (quizId != null && !quizId.isEmpty()) {
                Document quiz = quizzes.find(new Document("_id", new ObjectId(quizId))).first();
                if (quiz != null) quizTitle = quiz.getString("title");
            }

            Document query = new Document("status", "submitted");
            if (quizId != null && !quizId.isEmpty()) {
                query.append("quiz", new ObjectId(quizId));
            }

            for (Document attempt : attempts.find(query).sort(new Document("percentage", -1))) {
                String studentName = "Unknown";
                Object studentId = attempt.get("student");
                if (studentId != null) {
                    Document student = users.find(new Document("_id", studentId)).first();
                    if (student != null) studentName = student.getString("name");
                }
                int score      = attempt.getInteger("score", 0);
                int totalMarks = attempt.getInteger("totalMarks", 0);
                int percentage = attempt.getInteger("percentage", 0);
                boolean passed = Boolean.TRUE.equals(attempt.getBoolean("passed"));
                String submittedAt = attempt.getDate("submittedAt") != null
                        ? attempt.getDate("submittedAt").toString() : "N/A";

                Document r = new Document();
                r.append("studentName", studentName);
                r.append("score", score);
                r.append("totalMarks", totalMarks);
                r.append("percentage", percentage);
                r.append("passed", passed);
                r.append("submittedAt", submittedAt);
                results.add(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        int totalPassed = (int) results.stream().filter(r -> Boolean.TRUE.equals(r.getBoolean("passed"))).count();

        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        out.println("<title>Quiz Report - " + quizTitle + "</title>");
        out.println("<style>");
        out.println("* { margin:0; padding:0; box-sizing:border-box; }");
        out.println("body { font-family: 'Segoe UI', sans-serif; background:#f4f6f9; color:#1a1a2e; padding:40px; }");
        out.println(".container { max-width:900px; margin:0 auto; background:white; border-radius:12px; box-shadow:0 4px 24px rgba(0,0,0,0.08); overflow:hidden; }");
        out.println(".header { background:linear-gradient(135deg,#1e3a5f,#2563eb); color:white; padding:36px 40px; }");
        out.println(".header h1 { font-size:28px; font-weight:700; }");
        out.println(".header p { margin-top:6px; font-size:14px; opacity:0.75; }");
        out.println(".meta { display:flex; gap:24px; margin-top:20px; }");
        out.println(".meta-item { background:rgba(255,255,255,0.1); border-radius:8px; padding:10px 16px; font-size:13px; }");
        out.println(".meta-item span { display:block; opacity:0.7; font-size:11px; margin-bottom:2px; text-transform:uppercase; }");
        out.println(".body { padding:40px; }");
        out.println(".summary { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }");
        out.println(".card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; text-align:center; }");
        out.println(".card .value { font-size:32px; font-weight:700; color:#1e293b; }");
        out.println(".card .label { font-size:12px; color:#64748b; margin-top:4px; text-transform:uppercase; }");
        out.println("table { width:100%; border-collapse:collapse; font-size:14px; }");
        out.println("thead tr { background:#f8fafc; border-bottom:2px solid #e2e8f0; }");
        out.println("th { padding:12px 16px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b; }");
        out.println("td { padding:14px 16px; border-bottom:1px solid #f1f5f9; }");
        out.println(".pass { background:#dcfce7; color:#16a34a; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; }");
        out.println(".fail { background:#fee2e2; color:#dc2626; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; }");
        out.println(".print-btn { display:block; margin:32px auto 0; padding:12px 32px; background:#2563eb; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; }");
        out.println("@media print { .print-btn { display:none; } body { background:white; padding:0; } }");
        out.println("</style></head><body>");

        out.println("<div class='container'>");
        out.println("<div class='header'>");
        out.println("<h1>Quiz Result Report</h1>");
        out.println("<p>" + quizTitle + "</p>");
        out.println("<div class='meta'>");
        out.println("<div class='meta-item'><span>Total Students</span>" + results.size() + "</div>");
        out.println("<div class='meta-item'><span>Generated</span>" + new java.util.Date() + "</div>");
        out.println("</div></div>");

        out.println("<div class='body'>");

        if (results.isEmpty()) {
            out.println("<p style='text-align:center;padding:60px;color:#94a3b8'>No submitted attempts found.</p>");
        } else {
            out.println("<div class='summary'>");
            out.println("<div class='card'><div class='value'>" + results.size() + "</div><div class='label'>Total Attempts</div></div>");
            out.println("<div class='card'><div class='value' style='color:#16a34a'>" + totalPassed + "</div><div class='label'>Passed</div></div>");
            out.println("<div class='card'><div class='value' style='color:#dc2626'>" + (results.size() - totalPassed) + "</div><div class='label'>Failed</div></div>");
            out.println("</div>");

            out.println("<table><thead><tr>");
            out.println("<th>Rank</th><th>Student</th><th>Score</th><th>Percentage</th><th>Status</th><th>Submitted At</th>");
            out.println("</tr></thead><tbody>");

            String[] medals = {"🥇", "🥈", "🥉"};
            for (int i = 0; i < results.size(); i++) {
                Document r   = results.get(i);
                String rank  = i < 3 ? medals[i] : "#" + (i + 1);
                String badge = Boolean.TRUE.equals(r.getBoolean("passed"))
                        ? "<span class='pass'>PASS</span>" : "<span class='fail'>FAIL</span>";
                int pct      = r.getInteger("percentage", 0);
                String pctColor = pct >= 70 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";

                out.println("<tr>");
                out.println("<td>" + rank + "</td>");
                out.println("<td><strong>" + r.getString("studentName") + "</strong></td>");
                out.println("<td>" + r.getInteger("score") + " / " + r.getInteger("totalMarks") + "</td>");
                out.println("<td><span style='color:" + pctColor + ";font-weight:600'>" + pct + "%</span></td>");
                out.println("<td>" + badge + "</td>");
                out.println("<td style='color:#64748b;font-size:13px'>" + r.getString("submittedAt") + "</td>");
                out.println("</tr>");
            }
            out.println("</tbody></table>");
        }

        out.println("<button class='print-btn' onclick='window.print()'>🖨️ Print / Save as PDF</button>");
        out.println("</div></div></body></html>");
    }
}