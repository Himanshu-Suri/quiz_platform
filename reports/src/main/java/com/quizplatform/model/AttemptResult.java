package com.quizplatform.model;

public class AttemptResult {
    private String studentName;
    private String quizTitle;
    private int score;
    private int totalMarks;
    private double percentage;
    private boolean passed;
    private String submittedAt;

    public AttemptResult(String studentName, String quizTitle, int score,
                         int totalMarks, double percentage, boolean passed, String submittedAt) {
        this.studentName = studentName;
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.passed = passed;
        this.submittedAt = submittedAt;
    }

    public String getStudentName() { return studentName; }
    public String getQuizTitle() { return quizTitle; }
    public int getScore() { return score; }
    public int getTotalMarks() { return totalMarks; }
    public double getPercentage() { return percentage; }
    public boolean isPassed() { return passed; }
    public String getSubmittedAt() { return submittedAt; }
}