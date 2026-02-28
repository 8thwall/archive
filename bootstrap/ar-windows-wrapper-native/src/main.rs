fn main() {

    // Iterate over the arguments and save the in a vector
    let args: Vec<String> = std::env::args().skip(1).collect();

    // Get value of WORKSPACE_ENV env variable
    let workspace_env = std::env::var("WORKSPACE_ENV").unwrap();

    // get value of LLVM_USR env variable
    let llvm_usr = std::env::var("LLVM_USR").unwrap();

    // simple debug boolean variable
    let debug = false;

    // Load json from file path in workspace_env variable if
    let json_string = std::fs::read_to_string(workspace_env.clone()).expect(format!("Error reading workspace-env file: {}", workspace_env.clone()).as_str());
    // Load json serde value
    let json_value: serde_json::Value = serde_json::from_str(json_string.as_str()).expect(format!("Error parsing json in workspace-env file: {}", workspace_env.clone()).as_str());

    let bazel_output_base = json_value["BAZEL_OUTPUT_BASE"].as_str().unwrap();

    // if bazel_output_base (sometime it does, sometime it does not) starts with /c/ then I replace it with c:/ and save it in bazel_output_base
    let bazel_output_base = if bazel_output_base.clone().starts_with("/c/") {
        bazel_output_base.clone().replace("/c/", "c:/")
    } else {
        bazel_output_base.clone().to_string()
    };

    // I iterate over the arguments and replace bazel_output_base with escaped_bazel_output_base
    let mut new_args: Vec<String> = Vec::new();
    for argument in args.iter() {

        // if current_sandbox_directory starts with /c/ (sometime it does, sometime it does not) then I replace it with c:/ and save it in bazel_output_base
        let argument = if argument.clone().starts_with("/c/") {
            argument.clone().replace("/c/", "c:/")
        } else {
            argument.clone().to_string()
        };
        new_args.push(argument.replace("BAZEL_OUTPUT_BASE", bazel_output_base.as_str()));
    }

    // Output index as int
    let mut output_index: usize = 0;

    // Iterate over the arguments and save the output_name index
    for (index, argument) in args.iter().enumerate() {
        if argument == "r" {
            output_index = index + 1;
        }
    }

    // String for the output name
    let output_name = args[output_index].clone();

    // I run a process to call clang as follows:
    // $bazel_output_base/$llvm_usr/bin/llvm-ar "$@"
    // and printing all stdout and stderr

    let actual_tool = "llvm-ar.exe";
    let actual_tool_in_path = format!(
        "{bazel_output_base}/{llvm_usr}/bin/{actual_tool}",
        bazel_output_base = bazel_output_base,
        llvm_usr = llvm_usr,
        actual_tool = actual_tool);

    if debug {
        let actual_command = format!(
            "{actual_tool_in_path} {new_args}",
            actual_tool_in_path = actual_tool_in_path,
            new_args = new_args.join(" "));

        println!("========= {actual_tool} command ========\n{actual_command}",
        actual_command = actual_command);

        let output_name_commang_debug = output_name.clone() + "_ar-windows-wrapper-native_debug.txt";

        std::fs::write(output_name_commang_debug.clone(),
                       actual_command).expect(format!("Error writing file: {}", output_name_commang_debug.clone()).as_str());
    }

    let output = std::process::Command::new(actual_tool_in_path.clone())
        .args(new_args)
        .output()
        .expect(format!("Failed to execute process {}", actual_tool_in_path.clone()).as_str());

    // I print the status only if not success
    if !output.status.success() {
        println!("status: {}", output.status);
    }
    // I print stdout and stderr of cmd only if the are not empty
    if !output.stdout.is_empty() {
        println!("========= {} stdout ========\n{}", actual_tool, String::from_utf8(output.stdout).unwrap());
    }
    if !output.stderr.is_empty() {
        println!("========= {} stdout ========\n{}", actual_tool, String::from_utf8(output.stderr).unwrap());
    }

}
