#version 330 core

out vec4 color;
in vec3 vertexNormal;
in vec3 fragPos;
in vec2 texPos;

struct Light{
	vec4 lightVect;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constatnt;
	float linear;
	float quadratic;

};
struct Material{
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
	sampler2D diffuseTex;
	sampler2D specularTex;
	sampler2D emissionTex;

};

uniform Light light;
uniform Material material;

uniform vec3 viewPos;

uniform int isLight;


void main(){

	color = vec4(max(max(light.ambient, light.diffuse), light.specular), 1.0f);
	if(isLight == 0){
		vec3 ambient = texture(material.diffuseTex, texPos).rgb * light.ambient;

		vec3 norm = normalize(vertexNormal);
		vec3 lightDir;
		float attenuation = 1.0f;
		if(light.lightVect.w == 0.0f){
			lightDir = normalize(-light.lightVect.xyz);
		}else{
			lightDir = normalize(light.lightVect.xyz - fragPos);
			float distance = length(light.lightVect.xyz - fragPos);
			attenuation = 1.0f/(light.constatnt + (light.linear * distance)+ light.quadratic * distance * distance );
		}
		
		float diff = max(0.0f, dot(norm, lightDir));
		vec3 diffuse = diff * texture(material.diffuseTex, texPos).rgb * light.diffuse;

		vec3 viewDir = normalize(viewPos - fragPos);
		vec3 reflectDir = reflect(-lightDir, norm);
		float spec = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
		vec3 specular = length(texture(material.specularTex, texPos).rgb) * light.specular * spec;

		vec3 result = (ambient + diffuse + specular)*attenuation;
		//result += texture(material.emissionTex, texPos).rgb;	
		
		color = vec4(result, 1.0f);

//		color = vec4(texture(myTexture2, texPos));

	}

}