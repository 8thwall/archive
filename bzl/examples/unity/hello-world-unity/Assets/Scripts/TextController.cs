using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
using Niantic;

public class TextController : MonoBehaviour
{
    public TMPro.TextMeshProUGUI textField;

    // Start is called before the first frame update
    void Start()
    {
        textField.text = System.String.Format(
            "This is an int from c++: {0}\n{1}",
            HelloWorldPlugin.c8_exampleIntMethod(),
            Marshal.PtrToStringAnsi(HelloWorldPlugin.c8_exampleStringMethod()));
    }

    // Update is called once per frame
    void Update()
    {

    }
}
