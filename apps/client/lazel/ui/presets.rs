use super::super::bazel::{
    command::{Command, CommandMode},
    flag::Flag,
    label::Label,
    scope::Scope,
    target::{TargetPattern, TargetSpecifier},
};

#[derive(Clone)]
pub struct Preset {
    pub name: String,
    pub command: Command,
}

pub fn get_presets() -> Vec<Preset> {
    return vec![
        Preset {
            name: "Hello".into(),
            command: Command {
                mode: CommandMode::Run,
                target: vec![Label::try_from("//bzl/examples:hello").unwrap().into()],
                flags: vec![],
                run_args: vec![],
            },
        },
        Preset {
            name: "Example tests".into(),
            command: Command {
                mode: CommandMode::Test,
                target: vec![
                    Scope::try_from("//bzl/examples").unwrap().into(),
                    TargetSpecifier::from(Scope::try_from("//bzl/examples/unity").unwrap())
                        .invert(),
                ],
                flags: vec![Flag::k("k"), Flag::k("build_tests_only")],
                run_args: vec![],
            },
        },
        Preset {
            name: "three.js".into(),
            command: Command {
                mode: CommandMode::Run,
                target: vec![Label::try_from(
                    "//apps/client/exploratory/native-browse:native-browse",
                )
                .unwrap()
                .into()],
                flags: vec![
                    Flag::kv("config", "angle").unwrap(),
                    Flag::kv("features", "adbrun").unwrap(),
                ],
                run_args: vec!["https://threejs.org/examples/webgl_morphtargets_horse.html".into()],
            },
        },
        Preset {
            name: "studio-deploy".into(),
            command: Command {
                mode: CommandMode::Build,
                target: vec![TargetPattern::all(
                    Scope::try_from("//reality/cloud/aws/lambda/studio-deploy").unwrap(),
                )
                .into()],
                flags: vec![],
                run_args: vec![],
            },
        },
    ];
}
