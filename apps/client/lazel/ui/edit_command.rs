use gpui::*;
use prelude::FluentBuilder;

use crate::bazel::{
    command::{Command, CommandMode},
    flag::Flag,
    label::Label,
    scope::Scope,
    target::{TargetPattern, TargetSpecifier},
};

use super::checkbox::Checkbox;

#[allow(dead_code)]
#[derive(Clone)]
pub struct EditTarget {
    pub scope: String,
    pub name: Option<String>,
    pub scope_open: bool,
    pub name_open: bool,
    pub recursive: bool,
    pub inverted: bool,
    pub enabled: bool,
}

impl Render for EditTarget {
    fn render(&mut self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        return div()
            .flex()
            .flex_row()
            .items_start()
            .child(
                Checkbox {
                    checked: self.enabled,
                    on_change: Box::new(cx.listener(|view, checked, cx| {
                        view.enabled = *checked;
                        cx.notify();
                    })),
                }
                .render(cx),
            )
            .child(if self.inverted { "-" } else { "" })
            .child(self.scope.clone())
            .when_some_else(
                self.name.as_ref(),
                |el, v| el.child(":").child(v.clone()),
                |el| el.child(if self.recursive { "/..." } else { ":all" }),
            );
    }
}

impl From<TargetSpecifier> for EditTarget {
    fn from(current: TargetSpecifier) -> Self {
        let (scope, name, inverted, recursive) = {
            let (pattern, inverted) = match current {
                TargetSpecifier::Pattern(pattern) => (pattern, false),
                TargetSpecifier::NegativePattern(pattern) => (pattern, true),
            };

            let (scope, name, recursive) = match &pattern {
                TargetPattern::Single(label) => {
                    (label.get_scope(), Some(label.get_name().to_string()), false)
                }
                TargetPattern::All(scope) => (scope, None, false),
                TargetPattern::Prefix(scope) => (scope, None, true),
            };

            (scope.stringify(), name, inverted, recursive)
        };

        EditTarget {
            scope,
            name,
            inverted,
            recursive,
            scope_open: false,
            name_open: false,
            enabled: true,
        }
    }
}

impl TryFrom<&EditTarget> for TargetSpecifier {
    type Error = &'static str;

    fn try_from(edit: &EditTarget) -> Result<TargetSpecifier, Self::Error> {
        let scope = Scope::try_from(edit.scope.as_str())?;
        let pattern: TargetSpecifier = if let Some(name) = &edit.name {
            Label::under_scope(&scope, name).into()
        } else if edit.recursive {
            TargetPattern::all_recursive(scope).into()
        } else {
            TargetPattern::all(scope).into()
        };

        if edit.inverted {
            Ok(pattern.invert())
        } else {
            Ok(pattern)
        }
    }
}

#[allow(dead_code)]
pub struct EditFlag {
    pub key: String,
    pub value: Option<String>,
    pub enabled: bool,
}

impl Render for EditFlag {
    fn render(&mut self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        return div()
            .flex()
            .flex_row()
            .items_start()
            .gap_1()
            .child(
                Checkbox {
                    checked: self.enabled,
                    on_change: Box::new(cx.listener(|view, checked, cx| {
                        view.enabled = *checked;
                        cx.notify();
                    })),
                }
                .render(cx),
            )
            .child(self.key.clone())
            .when_some(self.value.as_ref(), |el, v| el.child("=").child(v.clone()));
    }
}

impl From<Flag> for EditFlag {
    fn from(current: Flag) -> Self {
        match current {
            Flag::K(key) => EditFlag {
                key,
                value: None,
                enabled: true,
            },
            Flag::KV(key, value) => EditFlag {
                key,
                value: Some(value),
                enabled: true,
            },
        }
    }
}

pub struct EditCommand {
    pub mode: CommandMode,
    pub flags: Vec<View<EditFlag>>,
    pub target: Vec<View<EditTarget>>,
    pub run_args: Vec<String>,
}

impl EditCommand {
    pub fn load<'a, T: 'a + 'static>(base_command: Command, cx: &mut ViewContext<T>) -> Self {
        let mut command = EditCommand {
            mode: base_command.mode,
            flags: vec![],
            target: vec![],
            run_args: base_command.run_args,
        };

        for flag in base_command.flags {
            command.flags.push(cx.new_view(|_| EditFlag::from(flag)));
        }

        for target in base_command.target {
            command
                .target
                .push(cx.new_view(|_| EditTarget::from(target)));
        }

        command
    }

    pub fn resolve(&self, cx: &AppContext) -> Result<Command, &'static str> {
        let mut flags: Vec<Flag> = Vec::new();
        let mut targets: Vec<TargetSpecifier> = Vec::new();

        self.flags
            .iter()
            .try_for_each(|flag_view| -> Result<(), &'static str> {
                let edit_flag = flag_view.read(cx);
                if !edit_flag.enabled {
                    return Ok(());
                }
                let flag = if let Some(value) = edit_flag.value.as_ref() {
                    Flag::kv(&edit_flag.key, &value).map_err(|_| "Invalid flag value")?
                } else {
                    Flag::k(&edit_flag.key)
                };

                flags.push(flag);

                Ok(())
            })?;

        self.target
            .iter()
            .try_for_each(|target_view| -> Result<(), &'static str> {
                let edit_target = target_view.read(cx);
                if !edit_target.enabled {
                    return Ok(());
                }
                targets.push(edit_target.try_into()?);
                Ok(())
            })?;

        Ok(Command {
            mode: self.mode,
            flags: flags,
            target: targets,
            run_args: self.run_args.clone(),
        })
    }
}
