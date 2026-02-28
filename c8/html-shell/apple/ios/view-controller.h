// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#pragma once

#import <UIKit/UIKit.h>

#define RENDER_IN_SAFE_AREA true

@protocol ViewControllerResizeDelegate <NSObject>
- (void)viewControllerDidResizeToSize:(CGSize)size;
@end

@interface ViewController : UIViewController
@property(nonatomic, weak) id<ViewControllerResizeDelegate> resizeDelegate;
@end
