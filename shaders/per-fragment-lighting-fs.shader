precision mediump float;

varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying vec2 vTextureCoord;

uniform float uMaterialShininess;

uniform vec3 uLightAmbient;

uniform vec3 uLightPosition;
uniform vec3 uLightSpecular;
uniform vec3 uLightDiffuse;
uniform sampler2D uSampler;
uniform float uAlpha;
//blended element is drawn without lightning so it's always really bright
uniform bool uUseLighting;

void main(void) {
    vec3 lightWeighting;

    vec3 lightDirection = normalize(uLightPosition - vPosition.xyz);
    vec3 normal = normalize(vTransformedNormal);

    float specularLightWeighting = 0.0;

    vec3 eyeDirection = normalize(-vPosition.xyz);
    vec3 reflectionDirection = reflect(-lightDirection, normal);

    specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);

    float diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
    if(uUseLighting)
        lightWeighting = uLightAmbient + uLightSpecular * specularLightWeighting + uLightDiffuse * diffuseLightWeighting;
    else
        lightWeighting = vec3(1.0, 1.0, 1.0);



    //vec4 fragmentColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a * uAlpha);
}

