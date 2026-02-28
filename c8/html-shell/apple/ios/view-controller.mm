// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#import "c8/html-shell/apple/ios/view-controller.h"

#include "c8/c8-log.h"
#include "c8/html-shell/apple/ios/shell-app-state.h"
#import "c8/html-shell/apple/ios/shell-view.h"

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  ShellView *shellView = [[ShellView alloc] initWithFrame:self.view.frame];
  shellView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addSubview:shellView];

  // Need to anchor the shellView to the view controller's view.
  // This ensures that the shellView resizes correctly with the view controller's view.
  // Otherwise, the input events won't be correctly mapped to the device screen bounds.
#if RENDER_IN_SAFE_AREA
  UILayoutGuide *guide = self.view.safeAreaLayoutGuide;
  [NSLayoutConstraint activateConstraints:@[
    [shellView.topAnchor constraintEqualToAnchor:guide.topAnchor],
    [shellView.bottomAnchor constraintEqualToAnchor:guide.bottomAnchor],
    [shellView.leadingAnchor constraintEqualToAnchor:guide.leadingAnchor],
    [shellView.trailingAnchor constraintEqualToAnchor:guide.trailingAnchor]
  ]];
#else
  [NSLayoutConstraint activateConstraints:@[
    [shellView.topAnchor constraintEqualToAnchor:self.view.topAnchor],
    [shellView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
    [shellView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
    [shellView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor]
  ]];
#endif
}

// This method is called when the view size changes, such as during device rotation.
- (void)viewWillTransitionToSize:(CGSize)size
       withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
  [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

  [coordinator
    animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
      if (
        self.resizeDelegate &&
        [self.resizeDelegate respondsToSelector:@selector(viewControllerDidResizeToSize:)]) {
        [self.resizeDelegate viewControllerDidResizeToSize:size];
      }
    }
                    completion:nil];
}

@end
