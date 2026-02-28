use gpui::*;

pub fn make_button() -> Div {
    div()
        .flex()
        .bg(rgb(0xffffff))
        .justify_center()
        .items_center()
        .whitespace_nowrap()
        .flex_col()
        .border_1()
        .min_w(px(64.0))
        .px_3()
        .border_color(rgb(0x000000))
        .text_color(rgb(0x0))
        .hover(|style| style.bg(rgb(0xf0f0f0)).cursor_pointer())
}
