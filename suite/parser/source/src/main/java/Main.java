/*
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite
 */

import parser.Schedule;

import java.io.File;
import java.nio.file.Files;

public class Main {
    public static void main(String[] arguments) {
        if (arguments.length >= 2) {
            try {
                String output = new Schedule(arguments[0]).toString();
                Files.write(new File(arguments[1]).toPath(),output.getBytes());
            } catch (Exception ignored) {
                ignored.printStackTrace();
            }
        }
    }
}
