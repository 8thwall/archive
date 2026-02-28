// Sets up an OSX ImGui app backed by OpenGL3.

#import <Cocoa/Cocoa.h>
#import <OpenGL/gl3.h>
#include <backends/imgui_impl_opengl3.h>
#include <backends/imgui_impl_osx.h>
#include <imgui.h>
#include <stdio.h>
#include <cstdlib>
#include <filesystem>
#include <string>
#include "implot.h"
#include "imnodes.h"

#include "c8/gui/imgui-app.h"
#include "c8/string/format.h"

#include "third_party/imgui/icons/IconsFontAwesome4.h"

//-----------------------------------------------------------------------------------
// ImGuiExampleView
//-----------------------------------------------------------------------------------
static std::string appName_ = "";
static void (*layoutUiInRenderThread_)(void) = nullptr;
static void (*applicationWillTerminate_)(void) = nullptr;

@interface ImGuiExampleView : NSOpenGLView
{
    NSTimer*    animationTimer;
}
@end

@implementation ImGuiExampleView

-(void)animationTimerFired:(NSTimer*)timer
{
    [self setNeedsDisplay:YES];
}

-(void)prepareOpenGL
{
    [super prepareOpenGL];

#ifndef DEBUG
    GLint swapInterval = 1;
    [[self openGLContext] setValues:&swapInterval forParameter:NSOpenGLContextParameterSwapInterval];
    if (swapInterval == 0)
        NSLog(@"Error: Cannot set swap interval.");
#endif
}

-(void)updateAndDrawDemoView
{
    // Start the Dear ImGui frame
	ImGui_ImplOpenGL3_NewFrame();
	ImGui_ImplOSX_NewFrame(self);
    ImGui::NewFrame();

    // Our state (make them static = more or less global) as a convenience to keep the example terse.
    static bool show_window = false;

    layoutUiInRenderThread_();

    static ImVec4 clear_color = ImVec4(45.0f / 255.0f, 46.0f / 255.0f, 67.0f / 255.0f, 1.00f);

	// Rendering
	ImGui::Render();
	[[self openGLContext] makeCurrentContext];

    ImDrawData* draw_data = ImGui::GetDrawData();
    GLsizei width  = (GLsizei)(draw_data->DisplaySize.x * draw_data->FramebufferScale.x);
    GLsizei height = (GLsizei)(draw_data->DisplaySize.y * draw_data->FramebufferScale.y);
    glViewport(0, 0, width, height);

	glClearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
	glClear(GL_COLOR_BUFFER_BIT);
	ImGui_ImplOpenGL3_RenderDrawData(draw_data);

    // Present
    [[self openGLContext] flushBuffer];

    if (!animationTimer)
        animationTimer = [NSTimer scheduledTimerWithTimeInterval:1.0f/60.0f target:self selector:@selector(animationTimerFired:) userInfo:nil repeats:YES];
}

-(void)reshape
{
    [super reshape];
    [[self openGLContext] update];
    [self updateAndDrawDemoView];
}

-(void)drawRect:(NSRect)bounds
{
    [self updateAndDrawDemoView];
}

-(BOOL)acceptsFirstResponder
{
    return (YES);
}

-(BOOL)becomeFirstResponder
{
    return (YES);
}

-(BOOL)resignFirstResponder
{
    return (YES);
}

-(void)dealloc
{
    animationTimer = nil;
}

// Forward Mouse/Keyboard events to dear imgui OSX backend. It returns true when imgui is expecting to use the event.
-(void)keyUp:(NSEvent *)event               { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)keyDown:(NSEvent *)event             { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)flagsChanged:(NSEvent *)event        { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)mouseDown:(NSEvent *)event           { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)rightMouseDown:(NSEvent *)event      { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)otherMouseDown:(NSEvent *)event      { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)mouseUp:(NSEvent *)event             { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)rightMouseUp:(NSEvent *)event        { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)otherMouseUp:(NSEvent *)event        { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)mouseMoved:(NSEvent *)event          { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)rightMouseMoved:(NSEvent *)event     { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)otherMouseMoved:(NSEvent *)event     { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)mouseDragged:(NSEvent *)event        { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)rightMouseDragged:(NSEvent *)event   { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)otherMouseDragged:(NSEvent *)event   { ImGui_ImplOSX_HandleEvent(event, self); }
-(void)scrollWheel:(NSEvent *)event         { ImGui_ImplOSX_HandleEvent(event, self); }

@end

//-----------------------------------------------------------------------------------
// ImGuiExampleAppDelegate
//-----------------------------------------------------------------------------------

@interface ImGuiExampleAppDelegate : NSObject <NSApplicationDelegate>
@property (nonatomic, readonly) NSWindow* window;
@end

@implementation ImGuiExampleAppDelegate
@synthesize window = _window;

-(BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication
{
    return YES;
}

-(NSWindow*)window
{
    if (_window != nil)
        return (_window);

    NSRect screenSize = [[NSScreen mainScreen] frame];
    NSRect viewRect = NSMakeRect(screenSize.size.width, screenSize.size.height, screenSize.size.width, screenSize.size.height);

    _window = [[NSWindow alloc] initWithContentRect:viewRect styleMask:NSWindowStyleMaskTitled|NSWindowStyleMaskMiniaturizable|NSWindowStyleMaskResizable|NSWindowStyleMaskClosable backing:NSBackingStoreBuffered defer:YES];
    [_window setTitle:[NSString stringWithUTF8String:appName_.c_str()]];
    [_window setAcceptsMouseMovedEvents:YES];
    [_window setOpaque:YES];
    [_window makeKeyAndOrderFront:NSApp];

    return (_window);
}

-(void)setupMenu
{
	NSMenu* mainMenuBar = [[NSMenu alloc] init];
    NSMenu* appMenu;
    NSMenuItem* menuItem;

    appMenu = [[NSMenu alloc] initWithTitle:[NSString stringWithUTF8String:appName_.c_str()]];
    menuItem = [appMenu addItemWithTitle:[NSString stringWithFormat: @"Quit %s", appName_.c_str()] action:@selector(terminate:) keyEquivalent:@"q"];
    [menuItem setKeyEquivalentModifierMask:NSEventModifierFlagCommand];

    menuItem = [[NSMenuItem alloc] init];
    [menuItem setSubmenu:appMenu];

    [mainMenuBar addItem:menuItem];

    appMenu = nil;
    [NSApp setMainMenu:mainMenuBar];
}

-(void)dealloc
{
    _window = nil;
}

-(void)applicationWillTerminate:(NSNotification *)aNotification {
    if (applicationWillTerminate_ != nullptr) {
      applicationWillTerminate_();
    }
    ImNodes::DestroyContext();
    ImPlot::DestroyContext();
    ImGui::DestroyContext();
}

-(void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
	// Make the application a foreground application (else it won't receive keyboard events)
	ProcessSerialNumber psn = {0, kCurrentProcess};
	TransformProcessType(&psn, kProcessTransformToForegroundApplication);

	// Menu
    [self setupMenu];

    NSImage *image = [[NSImage alloc]initWithContentsOfFile:@"c8/gui/eight-logo.png"];
    if (image != nil) {
        NSApp.applicationIconImage = image;
    }

    const CGLPixelFormatAttribute pixelFormatAttribs[] = {
        kCGLPFAAccelerated,
        kCGLPFAColorSize, static_cast<CGLPixelFormatAttribute>(24),
        kCGLPFAAlphaSize, static_cast<CGLPixelFormatAttribute>(8),
        kCGLPFADepthSize, static_cast<CGLPixelFormatAttribute>(32),
        kCGLPFAOpenGLProfile, static_cast<CGLPixelFormatAttribute>(kCGLOGLPVersion_3_2_Core),
        kCGLPFADoubleBuffer,
        static_cast<CGLPixelFormatAttribute>(0),  // Zero-terminated.
    };

    CGLError result;
    GLint numPixelFormats;
    CGLPixelFormatObj pixelFormat;

    result = CGLChoosePixelFormat(pixelFormatAttribs, &pixelFormat, &numPixelFormats);

    NSOpenGLPixelFormat* format = [[NSOpenGLPixelFormat alloc] initWithCGLPixelFormatObj:pixelFormat];

    ImGuiExampleView* view = [[ImGuiExampleView alloc] initWithFrame:self.window.frame pixelFormat:format];
    format = nil;
#if MAC_OS_X_VERSION_MAX_ALLOWED >= 1070
    if (floor(NSAppKitVersionNumber) > NSAppKitVersionNumber10_6)
        [view setWantsBestResolutionOpenGLSurface:YES];
#endif // MAC_OS_X_VERSION_MAX_ALLOWED >= 1070
    [self.window setContentView:view];

    if ([view openGLContext] == nil)
        NSLog(@"No OpenGL Context!");

	[[view openGLContext] makeCurrentContext];

    // Setup Dear ImGui context
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImPlot::CreateContext();
    ImNodes::CreateContext();
    ImGuiIO& io = ImGui::GetIO();

    // Save the imgui ini file at ~/.imgui/[appName_].ini
    auto inidir = std::filesystem::path(std::getenv("HOME")) / ".imgui";
    std::filesystem::create_directory(inidir);  // Create if needed, ignore failure if exists.
    c8::String path = inidir / c8::format("%s.ini", appName_.c_str());
    static std::unique_ptr<char[]> inipath;  // We need a stable memory location to hold the string.
    inipath.reset(new char[path.size() + 1]);
    std::memcpy(inipath.get(), path.c_str(), path.size() + 1);
    io.IniFilename = inipath.get();

    io.ConfigWindowsMoveFromTitleBarOnly = true;
    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;           // Enable Docking
    //io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;     // Enable Keyboard Controls
    //io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;      // Enable Gamepad Controls

    // Setup Dear ImGui style
    ImGui::StyleColorsDark();
    //ImGui::StyleColorsClassic();
    ImGui::GetStyle().FramePadding.x = 1.f;
    ImGui::GetStyle().ItemInnerSpacing.x = 3.f;
    ImGui::GetStyle().ItemSpacing.y = 3.f;
    ImGui::GetStyle().IndentSpacing = 15.f;

    // Setup Platform/Renderer backends
    ImGui_ImplOSX_Init();
    ImGui_ImplOpenGL3_Init();

    // Load Fonts
    // - If no fonts are loaded, dear imgui will use the default font. You can also load multiple fonts and use ImGui::PushFont()/PopFont() to select them.
    // - AddFontFromFileTTF() will return the ImFont* so you can store it if you need to select the font among multiple.
    // - If the file cannot be loaded, the function will return NULL. Please handle those errors in your application (e.g. use an assertion, or display an error and quit).
    // - The fonts will be rasterized at a given size (w/ oversampling) and stored into a texture when calling ImFontAtlas::Build()/GetTexDataAsXXXX(), which ImGui_ImplXXXX_NewFrame below will call.
    // - Read 'docs/FONTS.txt' for more instructions and details.
    // - Remember that in C/C++ if you want to include a backslash \ in a string literal you need to write a double backslash \\ !
    //io.Fonts->AddFontDefault();
    //io.Fonts->AddFontFromFileTTF("../../misc/fonts/Roboto-Medium.ttf", 16.0f);
    //io.Fonts->AddFontFromFileTTF("../../misc/fonts/Cousine-Regular.ttf", 15.0f);
    //io.Fonts->AddFontFromFileTTF("../../misc/fonts/DroidSans.ttf", 16.0f);
    //io.Fonts->AddFontFromFileTTF("../../misc/fonts/ProggyTiny.ttf", 10.0f);
    //ImFont* font = io.Fonts->AddFontFromFileTTF("c:\\Windows\\Fonts\\ArialUni.ttf", 18.0f, NULL, io.Fonts->GetGlyphRangesJapanese());
    //IM_ASSERT(font != NULL);

    // Icon fonts
    io.Fonts->AddFontDefault();
    ImFontConfig config;
    config.MergeMode = true;
    config.GlyphMinAdvanceX = 13.0f; // make icons monospace
    config.GlyphOffset.y += 2.f;
    const ImWchar icon_ranges[] = { ICON_MIN_FA, ICON_MAX_FA, 0 };
    ImFont* font = io.Fonts->AddFontFromFileTTF("third_party/imgui/icons/fontawesome-webfont.ttf", 13.0f, &config, icon_ranges);
    io.Fonts->Build();
    IM_ASSERT(font != NULL);
}

@end

namespace c8 {

int startImGuiWindow(const char* appName, void(*layoutUiInRenderThread)(void), void(*applicationWillTerminate)(void)) {
    appName_ = appName;
    layoutUiInRenderThread_ = layoutUiInRenderThread;
    applicationWillTerminate_ = applicationWillTerminate;
	@autoreleasepool
	{
		NSApp = [NSApplication sharedApplication];
		ImGuiExampleAppDelegate* delegate = [[ImGuiExampleAppDelegate alloc] init];
		[[NSApplication sharedApplication] setDelegate:delegate];
		[NSApp run];
	}
	const char* argv[0];  // Explicit pointer to an empty list.
	return NSApplicationMain(0, argv);
}

}
