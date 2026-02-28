using UnityEngine;
using System;

public class D : MonoBehaviour {
  A a;
  C c;
  void Start() {
    Debug.Log("I'm a D");
    a = new A();
    c = new C();
  }
}

