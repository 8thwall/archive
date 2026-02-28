#include <nan.h>
#include <node.h>

static int numConstructors = 0;
static int numDestructors = 0;

class MyObject : public Nan::ObjectWrap {
public:
  // Constructor that takes a double parameter
  explicit MyObject(double value = 0) : value_(value) {}

  static NAN_MODULE_INIT(Init) {
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("MyObject").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tpl, "getHandle", GetHandle);
    Nan::SetPrototypeMethod(tpl, "getValue", GetValue);

    constructor().Reset(Nan::GetFunction(tpl).ToLocalChecked());
    Nan::Set(target, Nan::New("MyObject").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
  }

  static NAN_METHOD(New) {
    if (info.IsConstructCall()) {
      double value = info[0]->IsUndefined() ? 0 : Nan::To<double>(info[0]).FromJust();
      MyObject *obj = new MyObject(value);
      obj->Wrap(info.This());
      info.GetReturnValue().Set(info.This());
      numConstructors++;
    } else {
      const int argc = 1;
      v8::Local<v8::Value> argv[argc] = {info[0]};
      v8::Local<v8::Function> cons = Nan::New(constructor());
      info.GetReturnValue().Set(Nan::NewInstance(cons, argc, argv).ToLocalChecked());
    }
  }

  static NAN_METHOD(GetHandle) {
    MyObject *obj = Nan::ObjectWrap::Unwrap<MyObject>(info.Holder());
    info.GetReturnValue().Set(obj->handle());
  }

  static NAN_METHOD(GetValue) {
    MyObject *obj = Nan::ObjectWrap::Unwrap<MyObject>(info.Holder());
    info.GetReturnValue().Set(obj->value_);
  }

  static Nan::Persistent<v8::Function> &constructor() {
    static Nan::Persistent<v8::Function> my_constructor;
    return my_constructor;
  }

  ~MyObject() { numDestructors++; }

private:
  double value_;
};

static NAN_METHOD(GetNumConstructors) { info.GetReturnValue().Set(numConstructors); }
static NAN_METHOD(GetNumDestructors) { info.GetReturnValue().Set(numDestructors); }

// Reset persistent references when addon is unloaded
void Cleanup(void *arg) { MyObject::constructor().Reset(); }

NAN_MODULE_INIT(Init) {
  MyObject::Init(target);

  Nan::SetMethod(target, "getNumConstructors", GetNumConstructors);
  Nan::SetMethod(target, "getNumDestructors", GetNumDestructors);

  v8::Isolate *isolate = target->GetIsolate();
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  node::Environment *env = node::GetCurrentEnvironment(context);

  node::AtExit(env, Cleanup, nullptr);
}

NAN_MODULE_WORKER_ENABLED(sampleaddon, Init)
