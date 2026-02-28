// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#include <Cocoa/Cocoa.h>

// Define a simple delegate class that listens for window and menu events
@interface AppDelegate : NSObject <NSApplicationDelegate, NSWindowDelegate>
@end

@implementation AppDelegate

// This method is called when the window is about to close
- (void)windowWillClose:(NSNotification *)notification {
    [NSApp terminate:nil]; // Terminate the app when the window closes
}

// Method to create the application menu
- (void)createMenu {
    NSMenu *mainMenu = [[NSMenu alloc] initWithTitle:@"MainMenu"];

    // Create the application menu
    NSMenuItem *appMenuItem = [[NSMenuItem alloc] initWithTitle:@"App" action:nil keyEquivalent:@""];
    [mainMenu addItem:appMenuItem];

    // Create the app submenu (File menu)
    NSMenu *appMenu = [[NSMenu alloc] initWithTitle:@"App"];
    [appMenu addItemWithTitle:@"Quit" action:@selector(terminate:) keyEquivalent:@"q"];
    [mainMenu setSubmenu:appMenu forItem:appMenuItem];

    // Set the main menu for the application
    [NSApp setMainMenu:mainMenu];
}

// Method to create and display text
- (void)createTextFieldInWindow:(NSWindow *)window {
    // Create a text field
    NSTextField *textField = [[NSTextField alloc] initWithFrame:NSMakeRect(20, 200, 360, 40)];
    [textField setStringValue:@"Hello, World!"]; // Set the text
    [textField setBezeled:NO]; // Remove border
    [textField setDrawsBackground:NO]; // Remove background
    [textField setEditable:NO]; // Make it non-editable
    [textField setSelectable:NO]; // Disable selection

    // Center the text
    [textField setAlignment:NSTextAlignmentCenter];

    // Add the text field to the window's content view
    [[window contentView] addSubview:textField];
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // Initialize the application instance
        [NSApplication sharedApplication];

        // Set up the window dimensions and style
        NSRect frame = NSMakeRect(100, 100, 400, 300);
        NSUInteger style = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskResizable;

        // Create the window with a title and frame
        NSWindow *window = [[NSWindow alloc] initWithContentRect:frame
                                                       styleMask:style
                                                         backing:NSBackingStoreBuffered
                                                           defer:NO];
        [window setTitle:@"Example C++ macOS Window"];

        // Create and set up the app delegate
        AppDelegate *delegate = [[AppDelegate alloc] init];
        [NSApp setDelegate:delegate];
        [window setDelegate:delegate]; // Set the delegate for the window as well

        // Create the menu
        [delegate createMenu];

        // Create and display the text field
        [delegate createTextFieldInWindow:window];

        // Show the window
        [window makeKeyAndOrderFront:nil];

        // Run the application event loop
        [NSApp run];
    }
    return 0;
}
