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
                Files.write(new File(arguments[1]).toPath(), new Schedule(arguments[0]).toString().getBytes());
            } catch (Exception ignored) {
            }
        }
    }
}
