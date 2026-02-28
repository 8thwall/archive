use gpui::*;

pub fn make_frame() -> Div {
    div()
        .flex()
        .w_full()
        .h_full()
        .relative()
        .pt_2()
        .bg(rgb(0xf0f0f0))
        .justify_start()
        .items_start()
        .flex_col()
        .gap_2()
}
