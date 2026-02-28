// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#pragma once

#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <QuartzCore/CADisplayLink.h>

// Define a simple delegate class that listens for window and menu events.
@interface AppDelegate : NSObject <NSApplicationDelegate, NSWindowDelegate>

@property(strong, nonatomic) CADisplayLink *displayLink API_AVAILABLE(macos(14.0));

- (void)createMenu;

@end
