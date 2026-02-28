use gpui::*;

pub fn make_h_split(left: impl IntoElement, right: impl IntoElement) -> Div {
    div()
        .flex()
        .flex_row()
        .justify_between()
        .items_start()
        .w_full()
        .gap_1()
        .px_2()
        .child(left)
        .child(right)
}
