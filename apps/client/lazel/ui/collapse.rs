use gpui::*;

fn make_collapse_toggle() -> Div {
    div()
        .flex()
        .flex_row()
        .justify_center()
        .items_center()
        .w_full()
        .h(px(14.0))
        .bg(rgb(0xffffff))
        .border_1()
        .border_l_0()
        .border_r_0()
        .border_color(rgb(0x000000))
        .hover(|style: StyleRefinement| style.bg(rgb(0xf0f0f0)).cursor_pointer())
}

fn make_icon() -> Svg {
    svg()
        .w(px(11.0))
        .h(px(4.0))
        .path("icons/collapse.svg")
        .text_color(rgb(0x0))
}

pub fn make_collapse() -> Div {
    make_collapse_toggle().child(make_icon())
}

pub fn make_expand() -> Div {
    make_collapse_toggle()
        .child(make_icon().with_transformation(Transformation::scale(size(1.0, -1.0))))
}
