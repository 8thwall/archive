#version 320 es

in vec3 position;
in vec3 color;
out vec3 pixColor;
uniform float angle;
void main()
{
    mat4 rotation = mat4(
        vec4(cos(angle), -sin(angle), 0.0, 0.0),
        vec4(sin(angle), cos(angle), 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
    pixColor = color;
    gl_Position = rotation * vec4(position.x, position.y, position.z, 1.0);
}
