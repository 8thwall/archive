#import "bzl/examples/ios/native//ViewController.h"

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    // Set the background color of the view
    self.view.backgroundColor = [UIColor whiteColor];

    // Create a UILabel for displaying text
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(20, 200, self.view.frame.size.width - 40, 40)];
    label.text = @"Hello, World!";
    label.textAlignment = NSTextAlignmentCenter;
    label.font = [UIFont systemFontOfSize:24];
    label.textColor = [UIColor blackColor];
    [self.view addSubview:label];

    // Create a UIButton for quitting the app (useful for debugging)
    UIButton *quitButton = [UIButton buttonWithType:UIButtonTypeSystem];
    quitButton.frame = CGRectMake((self.view.frame.size.width - 100) / 2, 300, 100, 50);
    [quitButton setTitle:@"Quit" forState:UIControlStateNormal];
    [quitButton addTarget:self action:@selector(quitApp) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:quitButton];
}

// Method to quit the app (note: only works in a simulator or for testing)
- (void)quitApp {
    exit(0);
}

@end
