use super::flag::Flag;
use super::target::TargetSpecifier;

#[derive(Copy, Clone, PartialEq)]
pub enum CommandMode {
    Build,
    Test,
    Run,
}

impl CommandMode {
    pub fn verb(&self) -> String {
        match self {
            CommandMode::Build => "Build".into(),
            CommandMode::Test => "Test".into(),
            CommandMode::Run => "Run".into(),
        }
    }

    pub fn loading_message(&self) -> String {
        match self {
            CommandMode::Build => "Building...".into(),
            CommandMode::Test => "Testing...".into(),
            CommandMode::Run => "Running...".into(),
        }
    }
}

#[derive(Clone)]
pub struct Command {
    pub mode: CommandMode,
    pub target: Vec<TargetSpecifier>,
    pub flags: Vec<Flag>,
    pub run_args: Vec<String>,
}

impl Command {
    pub fn stringify(&self) -> String {
        let mut result: String = "bazel ".into();
        match self.mode {
            CommandMode::Build => result.push_str("build"),
            CommandMode::Test => result.push_str("test"),
            CommandMode::Run => result.push_str("run"),
        }

        for flag in &self.flags {
            result.push_str(" ");
            result.push_str(&flag.stringify());
        }

        if self.mode != CommandMode::Run {
            result.push_str(" --");
        }

        for target in &self.target {
            result.push_str(" ");
            result.push_str(&target.stringify());
        }

        if self.mode == CommandMode::Run {
            result.push_str(" -- ");
            for arg in &self.run_args {
                result.push_str(" ");
                result.push_str(&arg);
            }
        }

        result
    }
}
