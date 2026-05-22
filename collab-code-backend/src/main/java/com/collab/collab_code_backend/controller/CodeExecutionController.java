package com.collab.collab_code_backend.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.nio.file.*;
import java.util.Map;

@RestController
@CrossOrigin
public class CodeExecutionController {

    @PostMapping("/run")
    public String runCode(@RequestBody Map<String, String> request) {

        String code = request.get("code");
        String language = request.get("language");

        try {
            switch (language.toLowerCase()) {

                case "java":
                    return runJava(code);

                case "python":
                    return runPython(code);

                case "javascript":
                    return runJS(code);

                default:
                    return "Unsupported language";

            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // ================= JAVA =================
    private String runJava(String code) throws Exception {

        // get class name dynamically
        String className = "Main";

        if (code.contains("class")) {
            String[] parts = code.split("class");
            if (parts.length > 1) {
                String[] nameParts = parts[1].trim().split("\\s+");
                className = nameParts[0];
            }
        }

        String fileName = className + ".java";

        // write code to file
        Files.write(Paths.get(fileName), code.getBytes());

        // compile
        Process compile = new ProcessBuilder("cmd.exe", "/c", "javac " + fileName).start();
        compile.waitFor();

        // run
        Process run = new ProcessBuilder("cmd.exe", "/c", "java " + className).start();

        return getOutput(run);
    }

    // ================= PYTHON =================
    private String runPython(String code) throws Exception {

        Files.write(Paths.get("script.py"), code.getBytes());

        Process run = new ProcessBuilder("cmd.exe", "/c", "py script.py").start();

        return getOutput(run);
    }

    // ================= JAVASCRIPT =================
    private String runJS(String code) throws Exception {

        Files.write(Paths.get("script.js"), code.getBytes());

        Process run = new ProcessBuilder("cmd.exe", "/c", "node script.js").start();

        return getOutput(run);
    }

    // ================= COMMON OUTPUT =================
    private String getOutput(Process process) throws Exception {

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
        );

        BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(process.getErrorStream())
        );

        StringBuilder output = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }

        while ((line = errorReader.readLine()) != null) {
            output.append(line).append("\n");
        }

        return output.toString();
    }
}