use gpui::*;
use std::{process::Stdio, vec};

use crate::bazel::{command::CommandMode, flag::Flag, label::Label, target::TargetSpecifier};

use super::{
    super::bazel::command::Command,
    actions::make_actions,
    assets::Assets,
    button::make_button,
    collapse::{make_collapse, make_expand},
    dropdown::Dropdown,
    edit_command::{EditCommand, EditFlag, EditTarget},
    frame::make_frame,
    h_split::make_h_split,
    menu::{Menu, MenuItem},
    presets::get_presets,
};

use async_process;

struct GlobalState {
    status: String,
    output: Vec<String>,
    active_run: usize,
    edit_command: EditCommand,
    accordion_expanded: bool,
    mode_expanded: bool,
}

impl GlobalState {
    fn set_mode(&mut self, mode: CommandMode, cx: &mut ViewContext<Self>) {
        self.mode_expanded = false;
        self.edit_command.mode = mode;
        cx.notify();
    }

    fn new_target(&mut self, cx: &mut ViewContext<Self>) {
        self.edit_command.target.push(cx.new_view(|_| {
            EditTarget::from(TargetSpecifier::from(
                Label::try_from("//bzl/examples:hello").unwrap(),
            ))
        }));
        cx.notify();
    }

    fn new_flag(&mut self, cx: &mut ViewContext<Self>) {
        self.edit_command
            .flags
            .push(cx.new_view(|_| EditFlag::from(Flag::kv("example", "value").unwrap())));
        cx.notify();
    }

    fn on_build(&mut self, _event: &MouseUpEvent, cx: &mut ViewContext<Self>) {
        let command: Command = match self.edit_command.resolve(cx) {
            Ok(c) => c,
            Err(e) => {
                self.status = e.into();
                cx.notify();
                return;
            }
        };

        self.status = command.mode.loading_message();
        self.output.clear();
        let run_id: usize = self.active_run + 1;
        self.active_run = run_id;
        cx.notify();

        let command_to_run: String = command.stringify();

        cx.spawn(|s, mut async_cx| async move {
            let output = async_process::Command::new("sh")
                .arg("-c")
                .arg(command_to_run)
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output()
                .await
                .expect("failed to execute process");

            s.update(&mut async_cx, |async_state, cx| {
                if run_id != async_state.active_run {
                    return;
                }

                async_state.output.clear();

                if output.status.success() {
                    async_state.status = "Success".into();
                } else {
                    async_state.status = "Failed".into();
                }

                async_state
                    .output
                    .push(String::from_utf8(output.stdout).unwrap().trim().into());
                async_state
                    .output
                    .push(String::from_utf8(output.stderr).unwrap().trim().into());

                cx.notify();
            })
            .unwrap();
        })
        .detach();
    }
}

impl Render for GlobalState {
    fn render(&mut self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        let command_attempt = self.edit_command.resolve(cx);
        let visible_command = command_attempt.map(|e| e.stringify());

        let command_preview = match visible_command.clone() {
            Ok(command_to_copy) => div()
                .flex()
                .gap_1()
                .flex_wrap()
                .child(command_to_copy.clone())
                .child(make_button().child("Copy command").on_mouse_up(
                    MouseButton::Left,
                    cx.listener(move |_, __, cx| {
                        cx.write_to_clipboard(ClipboardItem::new(command_to_copy.clone()));
                    }),
                )),
            Err(message) => div().child(message),
        };

        let mut option_row = div().flex().flex_row().gap_1().justify_start().flex_wrap();

        for preset in get_presets().into_iter() {
            let active = match visible_command.clone() {
                Ok(command) => command == preset.command.stringify(),
                Err(_) => false,
            };
            let mut button = make_button()
                .on_mouse_up(
                    MouseButton::Left,
                    cx.listener(move |view, __, cx| {
                        view.edit_command = EditCommand::load(preset.command.clone(), cx);
                        cx.notify();
                    }),
                )
                .child(preset.name);

            if active {
                button = button.bg(rgb(0xcccccc)).cursor_default();
            }

            option_row = option_row.child(button);
        }

        let mode_menu = Menu {
            items: vec![
                MenuItem {
                    label: "Build".into(),
                    action: Box::new(cx.listener(|data, _, cx| {
                        data.set_mode(CommandMode::Build, cx);
                    })),
                },
                MenuItem {
                    label: "Test".into(),
                    action: Box::new(cx.listener(|data, _, cx| {
                        data.set_mode(CommandMode::Test, cx);
                    })),
                },
                MenuItem {
                    label: "Run".into(),
                    action: Box::new(cx.listener(|data, _, cx| {
                        data.set_mode(CommandMode::Run, cx);
                    })),
                },
            ],
        }
        .render(cx)
        .into_any_element();

        let mode_dropdown = Dropdown {
            open: self.mode_expanded,
            on_open_change: Box::new(cx.listener(|view, b, cx| {
                view.mode_expanded = *b;
                cx.notify();
            })),
            trigger: "...".into(),
            contents: vec![mode_menu],
        };

        let build_button = make_button()
            .on_mouse_up(MouseButton::Left, cx.listener(Self::on_build))
            .child(self.edit_command.mode.verb());

        let mut output_el = div().flex().flex_col();

        for line in &self.output {
            output_el = output_el.child(line.clone());
        }

        let mut frame: Div = make_frame();

        frame = frame.child(make_h_split(
            option_row,
            make_actions()
                .child(self.status.clone())
                .child(build_button)
                .child(mode_dropdown.render(cx)),
        ));

        let accordion = {
            let toggle = if self.accordion_expanded {
                make_collapse()
            } else {
                make_expand()
            }
            .on_mouse_down(
                MouseButton::Left,
                cx.listener(move |view, __, cx| {
                    view.accordion_expanded = !view.accordion_expanded;
                    cx.notify();
                }),
            );

            if self.accordion_expanded {
                let contents = div()
                    .flex()
                    .relative()
                    .w_full()
                    .border_t_1()
                    .border_color(rgb(0x000000))
                    .bg(rgb(0xd0d0d0))
                    .justify_start()
                    .content_stretch()
                    .flex_col()
                    .p_2()
                    .gap_0p5();

                let mut target_row = div().flex().flex_row().gap_1().justify_start().flex_wrap();

                for edit_target in &self.edit_command.target {
                    let edit_target = edit_target.clone();
                    target_row = target_row.child(edit_target);
                }

                let new_target_button = make_button().child("Add target").on_mouse_up(
                    MouseButton::Left,
                    cx.listener(|view, _, cx| {
                        view.new_target(cx);
                    }),
                );

                let mut flag_row = div().flex().flex_row().gap_1().justify_start().flex_wrap();

                for edit_flag in &self.edit_command.flags {
                    let edit_flag = edit_flag.clone();
                    flag_row = flag_row.child(edit_flag);
                }

                let new_flag_button = make_button().child("Add flag").on_mouse_up(
                    MouseButton::Left,
                    cx.listener(|view, _, cx| {
                        view.new_flag(cx);
                    }),
                );

                div()
                    .child(
                        contents
                            .child(make_h_split(target_row, new_target_button))
                            .child(make_h_split(flag_row, new_flag_button))
                            .child(command_preview),
                    )
                    .child(toggle)
            } else {
                toggle
            }
        };

        frame = frame.child(accordion);

        frame = frame.child(output_el);

        frame
    }
}

pub fn start_app() {
    App::new().with_assets(Assets).run(|cx: &mut AppContext| {
        cx.activate(false);
        let bounds = Bounds::centered(None, size(px(700.0), px(500.0)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                focus: true,
                ..Default::default()
            },
            |cx| {
                cx.new_view(|cx: &mut ViewContext<GlobalState>| GlobalState {
                    edit_command: EditCommand::load(
                        get_presets().into_iter().next().unwrap().command,
                        cx,
                    ),
                    status: "Ready.".into(),
                    output: vec![],
                    active_run: 0,
                    accordion_expanded: false,
                    mode_expanded: false,
                })
            },
        )
        .unwrap();
    });
}
