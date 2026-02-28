// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#pragma once

#import <UIKit/UIKit.h>

#import "view-controller.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, ViewControllerResizeDelegate>

@property(strong, nonatomic) UIWindow *window;
@property(strong, nonatomic) CADisplayLink *displayLink;

@end
