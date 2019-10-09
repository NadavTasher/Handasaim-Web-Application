/*
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite
 */

package parser;

import org.apache.poi.hssf.usermodel.HSSFShape;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFTextbox;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFShape;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFSimpleShape;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

public class Schedule extends JSONObject {

    private static final String SUBJECTS = "subjects";
    private static final String MESSAGES = "messages";
    private static final String TEACHERS = "teachers";
    private static final String SCHEDULE = "schedule";
    private static final String ERRORS = "errors";
    private static final String GRADES = "grades";
    private static final String GRADE = "grade";
    private static final String NAME = "name";
    private static final String DAY = "day";

    private static String[] DAYS = {
            "ראשון",
            "שני",
            "שלישי",
            "רביעי",
            "חמישי",
            "שישי",
            "שבת"
    };

    private static String[][] TRIMMERS = {
            {", ", " · "},
            {",", " · "},
            {"מתמטיקה", "מתמט'"},
            {"טכניונית", "טכ'"},
            {"מעבדה", "מע'"}
    };

    public Schedule(String path) throws Exception {
        // Initialize sheet
        Sheet sheet = initializeSheet(path);
        // Check if sheet is null
        if (sheet != null) {
            // Initialize messages
            put(MESSAGES, parseMessages(sheet));
            // Initialize day
            put(DAY, parseDay(sheet));
            // Initialize grades
            put(GRADES, parseGrades(sheet));
            // Initialize teachers
            put(TEACHERS, parseTeachers(getJSONArray(GRADES)));
            // Add ringing times
            put(SCHEDULE, new int[]{465, 510, 555, 615, 660, 730, 775, 830, 875, 930, 975, 1020, 1065});
        }
    }

    private void error(String error) {
        // Read array from structure
        JSONArray errors = optJSONArray(ERRORS);
        // Initialize if null
        if (errors == null) errors = new JSONArray();
        // Push 'error' to array
        errors.put(error);
        // Write array to structure
        put(ERRORS, errors);
    }

    private int parseGrade(String name) {
        // Parse grade from name
        if (name.startsWith("ז")) return 7;
        if (name.startsWith("ח")) return 8;
        if (name.startsWith("ט")) return 9;
        if (name.startsWith("יב")) return 12;
        if (name.startsWith("יא")) return 11;
        if (name.startsWith("י")) return 10;
        return 0;
    }

    private int parseDay(Sheet sheet) {
        // Get cell value
        String day = parseCell(sheet, 0, 0);
        // Loop through days and compare until match found and return the number of the day (1-7, on error 0)
        for (int d = 0; d < DAYS.length; d++) {
            if (DAYS[d].equals(day)) return d + 1;
        }
        return 0;
    }

    private Sheet initializeSheet(String path) throws Exception {
        // Initialize input stream
        InputStream stream = new FileInputStream(new File(path));
        // Initialize workbook
        Workbook workbook = null;
        // Create a workbook of right type by examining file type
        if (path.endsWith(".xls")) {
            workbook = new HSSFWorkbook(new POIFSFileSystem(stream));
        } else if (path.endsWith(".xlsx")) {
            workbook = new XSSFWorkbook(stream);
        }
        // Verify that the file was actually an Excel file, won't proceed if type detected isn't supported
        if (workbook != null) {
            // Loop through sheets
            for (int s = 0; s < workbook.getNumberOfSheets(); s++) {
                Sheet current = workbook.getSheetAt(s);
                // Check for minimum rows
                if (current.getLastRowNum() > 1) {
                    // Return sheet
                    return current;
                }
            }
        }
        return null;
    }

    private String parseCell(Sheet sheet, int x, int y) {
        return parseCell(sheet.getRow(y).getCell(x));
    }

    private String parseCell(Cell cell) {
        if (cell != null) {
            switch (cell.getCellType()) {
                case STRING:
                    return cell.getStringCellValue();
                case NUMERIC:
                    return String.valueOf((int) cell.getNumericCellValue());
            }
        }
        return "";
    }

    private String parseSubject(String untrimmed) {
        // Loop through replacements to shorten names
        for (String[] replacement : TRIMMERS) {
            if (replacement.length == 2)
                untrimmed = untrimmed.replaceAll(replacement[0], replacement[1]);
        }
        return untrimmed;
    }

    private JSONArray parseGrades(Sheet sheet) {
        JSONArray grades = new JSONArray();
        // If the cell after day name is empty, first row is 1, else 0
        int firstRow = parseCell(sheet, 1, 0).isEmpty() ? 1 : 0;
        // First column is always after the hour column
        int firstColumn = 1;
        int lastRow = sheet.getLastRowNum();
        int lastColumn = sheet.getRow(firstRow).getLastCellNum();
        // Loop through columns
        for (int c = firstColumn; c < lastColumn; c++) {
            // Create grade structure
            JSONObject grade = new JSONObject();
            // Parse minimal grade name
            String name = parseCell(sheet, c, firstRow).split(" ")[0];
            // Put grade name
            grade.put(NAME, name);
            // Put parsed grade number (7-12)
            grade.put(GRADE, parseGrade(name));
            // Create subjects structure
            JSONObject subjects = new JSONObject();
            // Loop through rows, first row is the one after the title
            for (int r = firstRow + 1; r < lastRow; r++) {
                // Get cell value
                String text = parseCell(sheet, c, r);
                // Check if cell is not empty
                if (!text.isEmpty()) {
                    // Create parseSubject and teachers structure
                    JSONObject subject = new JSONObject();
                    JSONArray teachers = new JSONArray();
                    // Split cell to rows
                    String[] rows = text.split("(|\r)(\n)");
                    // Put trimmed parseSubject name in parseSubject
                    subject.put(NAME, parseSubject(rows[0]));
                    // Check if cell has more then one row
                    if (rows.length > 1) {
                        // Loop through last row divided by commas and add to teachers
                        for (String teacher : rows[rows.length - 1].split("(|\\s),(|\\s)")) teachers.put(teacher);
                    }
                    // Put teachers in parseSubject
                    subject.put(TEACHERS, teachers);
                    // Put parseSubject in subjects as hour number (0-13+), for easy scanning
                    subjects.put(String.valueOf(r - (firstRow + 1)), subject);
                }
            }
            // Put subjects in grade
            grade.put(SUBJECTS, subjects);
            // Put grade in grades
            grades.put(grade);
        }
        return grades;
    }

    private JSONArray parseMessages(Sheet sheet) {
        JSONArray messages = new JSONArray();
        try {
            // Check type of sheet
            if (sheet.getWorkbook() instanceof HSSFWorkbook) {
                // Get messages list
                List<HSSFShape> shapes = ((HSSFSheet) sheet).createDrawingPatriarch().getChildren();
                // Loop through shapes
                for (HSSFShape shape : shapes) {
                    if (shape instanceof HSSFTextbox) {
                        // Add to list
                        messages.put(((HSSFTextbox) shape).getString().getString());
                    }
                }
            } else {
                // Get messages list
                List<XSSFShape> shapes = ((XSSFSheet) sheet).createDrawingPatriarch().getShapes();
                // Loop through shapes
                for (XSSFShape shape : shapes) {
                    if (shape instanceof XSSFSimpleShape) {
                        // Add to list
                        messages.put(((XSSFSimpleShape) shape).getText());
                    }
                }
            }
        } catch (Exception ignored) {
            error("Failed reading messages");
        }
        return messages;
    }

    private JSONArray parseTeachers(JSONArray grades) {
        // Initialize teachers array
        JSONArray teachers = new JSONArray();
        // Loop through grades
        for (Object grade : grades) {
            // Loop through subjects
            for (String hour : ((JSONObject) grade).getJSONObject(SUBJECTS).keySet()) {
                // Loop through teacher name array in parseSubject
                for (Object name : ((JSONObject) grade).getJSONObject(SUBJECTS).getJSONObject(hour).getJSONArray(TEACHERS)) {
                    // Check type of object
                    if (name instanceof String) {
                        // Initialize flag
                        boolean found = false;
                        // Loop through teachers array
                        for (Object teacher : teachers) {
                            // Check type of object
                            if (teacher instanceof JSONObject) {
                                // Check if array name starts with teacher name of vice versa (e.g. John J and John or John and John J will match, but John J and John D won't)
                                if (((String) name).startsWith(((JSONObject) teacher).getString(NAME)) || ((JSONObject) teacher).getString(NAME).startsWith(((String) name))) {
                                    // Pull subjects object from teacher
                                    JSONObject subjects = ((JSONObject) teacher).getJSONObject(SUBJECTS);
                                    // Insert subject
                                    subjects.put(hour, ((JSONObject) grade).getString(NAME));
                                    // Check if subject's teacher name is longer, and replace.
                                    if (((String) name).length() > ((JSONObject) teacher).getString(NAME).length()) {
                                        // Replace teacher name
                                        ((JSONObject) teacher).put(NAME, name);
                                    }
                                    // Put subjects object in teacher
                                    ((JSONObject) teacher).put(SUBJECTS, subjects);
                                    // Change flag
                                    found = true;
                                }
                            }
                        }
                        // Check flag
                        if (!found) {
                            // Create new teacher object and subjects object
                            JSONObject teacher = new JSONObject();
                            JSONObject subjects = new JSONObject();
                            // Insert subject
                            subjects.put(hour, ((JSONObject) grade).getString(NAME));
                            // Put name
                            teacher.put(NAME, name);
                            // Put subjects object in teacher
                            teacher.put(SUBJECTS, subjects);
                            // Put teacher in teachers array
                            teachers.put(teacher);
                        }
                    }
                }
            }
        }
        return teachers;
    }
}
