export const CONFIG_WATER_MATERIAL = {
  VertexDefinitions: `
          varying vec2 customUV;
        `,
  VertexBeforePositionUpdated: `
          customUV = uv;
        `,
  FragmentDefinitions: `
        varying vec2 customUV;

        float fbm(vec2 uv)
        {
          float f;
          mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
          f  = 0.5000*texture2D( noiseTexture, vec2(uv.x*speedFragment + sin(time * 0.25)*speedFragment, uv.y*0.525 + time * speedFragment) ).r; uv = m*uv;
          f += 0.2500*texture2D( noiseTexture, vec2(uv.x*speedFragment + sin(time * 0.25)*speedFragment, uv.y*0.525 + time * speedFragment) ).r; uv = m*uv;
          f += 0.1250*texture2D( noiseTexture, vec2(uv.x*speedFragment + sin(time * 0.25)*speedFragment, uv.y*0.525 + time * speedFragment) ).r; uv = m*uv;
          f += 0.0625*texture2D( noiseTexture, vec2(uv.x*speedFragment + sin(time * 0.25)*speedFragment, uv.y*0.525 + time * speedFragment) ).r; uv = m*uv;
          f = 0.5 + 0.5*f;
          return f;
        }
      `,
  FragmentBeforeFragColor: `
            vec2 cuv = customUV * scale;

            float strength = floor(cuv.x+1.0);
            float strength1 = floor(cuv.x+1.0);
            float T3 = max(3.,1.25*strength) * time * speedFragment;
            float T3_1 = max(3.,1.25*strength1) * time * speedFragment*0.1;

            float n = fbm(strength * vec2(cuv.x, cuv.y) + vec2(T3 * 0.01,T3));
            float n1 = fbm(strength1 * vec2(cuv.x, cuv.y) + vec2(T3_1 * 0.01,T3_1));

            float subtract = texture2D(alphaTexture, cuv).r;

            //clamp border
                          vec2 q1 = customUV;
                               q1 = ( q1-0.5 ) * vec2(0.0, 1.0);
                                        float glow1 = 0.2;
                                        float radius1 = 0.7;
                                        float force1 = dot( q1, q1 );
                                        vec2 weight1 = vec2(radius1 * radius1 + radius1 * glow1, radius1 * radius1 - radius1 * glow1)*n;
                                        float clamped1 = 1.0 - clamp(
                                            ( force1 - weight1.y ) / ( weight1.x - weight1.y ), 0.0, 1.0
                                        );
                                        vec4 clampCircle1 = vec4( vec3(1.1) * clamped1, 1.0 )*0.7;

            //clamp border
              vec2 q = customUV;
                   q = ( q-0.5 ) * vec2(1.0, 0.0);
                            float glow = 0.4;
                            float radius = 0.5;
                            float force = dot( q, q );
                            vec2 weight = vec2(radius * radius + radius * glow, radius * radius - radius * glow)*n;
                            float clamped = 1.0 - clamp(
                                ( force - weight.y ) / ( weight.x - weight.y ), 0.0, 1.0
                            );
                            vec4 clampCircle = vec4( vec3(1.1) * clamped, 1.0 );

            // foam
            vec4 texColFoam =mix( mix(
                                                texture2D( foamTextureUp, vec2(cuv.x*1.75, (cuv.y*n1*1.5 + time * speedFoamFragment)) ),
                                                vec4( 0.0, 0.0, 0.0, 0.0 ),
                                                cuv.y * 3.2 - 0.95
                                            ),
                                        vec4( 0.0, 0.0, 0.0, 0.0 ),
                                        1.0 - (cuv.y*4.0 )
                                     );

            vec4 texColUp = vec4( texColFoam.rgb * n * 0.9 * (1.0 - subtract), 1.0);

            //water
            vec4 texCol = mix(
                              mix( texture2D( upTexture, vec2(cuv.x*0.25, (cuv.y*0.02) ) ),
                                   texture2D( upTexture, vec2(cuv.x*0.125, (cuv.y*0.3 + time * speedFragment) ) ),
                                   cuv.y*5.1 - 3.8),
                              texture2D( upTexture, vec2(cuv.x*0.1, (cuv.y * 0.9 + time * speedFragment) ) ),
                              cuv.y*5.1 - 2.7
                          );
            mat3 tfm;
            tfm[0] = vec3(texCol.x,0.0,0.0);
            tfm[1] = vec3(0.0,texCol.y,0.0);
            tfm[2] = vec3(0.0,0.0,texCol.z);
            vec2 muv = vec2(sin(vec3(cuv,1.0)*tfm).x, sin(vec3(cuv,1.0)*tfm).y * 0.9);

              texCol = vec4( vec3(texture2D(backTexture, muv)) * 5.0 * color, 1.0 ); //default 2.9
              vec4 texelColor = max(texCol, texColUp) * clampCircle;
              texelColor.a =  max( max(texCol.r, max(texCol.g, texCol.b)),
                                   max(texColUp.r, max(texColUp.g, texColUp.b))

                                  ) * clampCircle.r * clampCircle1.r - subtract;


     finalColor *= texelColor;
     finalColor.a *= 2.0;
      `,
};
