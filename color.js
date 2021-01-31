/**
 * Copyright 2017 IBM Corp.
 * Copyright 2019 Ben Hardill
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

 module.exports = function(RED) {

  "use strict";
  var convertColor = require('color-convert');


  function convert(n) {
    RED.nodes.createNode(this,n);
    this.output = n.output;
    this.input = n.input;
    this.outputType = n.outputType;
    this.scaleInput = n.scaleInput;
    var node = this;

    node.on('input', function(msg, send, done){

      send = send || function() { node.send.apply(node,arguments) }

      var responseValue;
      var input = msg.payload;

      if (!Array.isArray(input) && typeof input === 'object'){
        var array = [];
        if (input.hasOwnProperty('hue') && input.hasOwnProperty('saturation')){
          array.push(input.hue);
          if (node.scaleInput) {
            array.push(input.saturation * 100);
          } else {
            array.push(input.saturation);
          }
          if (input.hasOwnProperty("lightness") && node.input === 'hsl') {
            if (node.scaleInput) {
               array.push(input.lightness * 100);
            } else {
              array.push(input.lightness);
            }
          } else if (input.hasOwnProperty("value") && node.input === 'hsv') {
            if (node.scaleInput) {
              array.push(input.value * 100);
            } else {
               array.push(input.value);
            }
          } else if (input.hasOwnProperty("brightness") && node.input === 'hsv') {

            if (node.scaleInput) {
              array.push(input.brightness * 100 );
            } else {
               array.push(input.brightness);
            }
          }
        } else if (node.input === 'rgb') {
          if (input.hasOwnProperty("red") && input.hasOwnProperty("green") && input.hasOwnProperty("blue")) {
            array.push(input.red);
            array.push(input.green);
            array.push(input.blue);
          } else if (input.hasOwnProperty("r") && input.hasOwnProperty("g") && input.hasOwnProperty("b")) {
            array.push(input.r);
            array.push(input.g);
            array.push(input.b);
          }
        }
        input =  array;
      }

      switch(node.input) {
        case 'rgb':
          if (Array.isArray(input)) {
            if (input.length === 3) {
              switch(node.output){
                case 'rgb':
                  responseValue = input;
                  break;
                case 'hsv':
                  responseValue = convertColor.rgb.hsv(input);
                  break;
                case 'hsl':
                  responseValue = convertColor.rgb.hsl(input);
                  break;
                case 'css':
                  responseValue = convertColor.rgb.keyword(input);
                  break;
                case 'hex':
                  responseValue = convertColor.rgb.hex(input);
                  break;
              }
              if (node.outputType === 'object' && node.output === 'rgb' ) {
                var obj = {
                  red: responseValue[0],
                  green: responseValue[1],
                  blue: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'hsv' ) {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  value: responseValue[2]
                }
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'hsl' ) {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  lightness: responseValue[2]
                }
                responseValue = obj;
              } else if (node.outputType === 'string' && node.output != "css" && node.output != "hex") {
                var str = responseValue.join(',');
                responseValue = str;
              }
              else if (node.outputType === 'string' && node.output === "hex" ) {
                var str = '#'+responseValue
                responseValue = str;
              }
            } else {
              if (done) {
                done("Array wrong size");
              } else {
                node.error("Array wrong size", msg);
              }
              return;
            }
          } else {
            if (done) {
              done("Input not an array")
            } else {
              node.error("Input not an array", msg);
            }
            return;
          }
          break;
        case 'hsv':
          if (Array.isArray(input)) {
            if (input.length === 3) {
              switch(node.output){
                case 'hsv':
                  responseValue = input;
                  break;
                case 'rgb':
                  responseValue = convertColor.hsv.rgb(input);
                  break;
                case 'hsl':
                  responseValue = convertColor.hsv.hsl(input);
                  break;
                case 'css':
                  responseValue = convertColor.hsv.keyword(input);
                  break;
                case 'hex':
                  responseValue = convertColor.hsv.hex(input);
                  break;
              }
              if (node.outputType === 'object' && node.output === 'hsl') {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  lightness: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'hsv') {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  value: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'rgb') {
                var obj = {
                  red: responseValue[0],
                  green: responseValue[1],
                  blue: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'string' && node.output != "css" && node.output != "hex" ) {
                var str = responseValue.join(',');
                responseValue = str;
              }
              else if (node.outputType === 'string' && node.output === "hex") {
                var str = responseValue
                responseValue = '#'+str;
              }
            }
          } else {
            if (done) {
              done ("Input not an array")
            } else {
              node.error("Input not an array", msg);
            }
            return;
          }
          break;
        case 'hsl':
          if (Array.isArray(input)) {
            if (input.length === 3) {
              switch(node.output){
                case 'hsl':
                  responseValue = input;
                  break;
                case 'rgb':
                  responseValue = convertColor.hsl.rgb(input);
                  break;
                case 'hsv':
                  responseValue = convertColor.hsl.hsv(input);
                  break;
                case 'css':
                  responseValue = convertColor.hsl.keyword(input);
                  break;
                case 'hex':
                  responseValue = '#'+convertColor.hsl.hex(input);
              }
              if (node.outputType === 'object' && node.output === 'hsl') {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  lightness: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'hsv') {
                var obj = {
                  hue: responseValue[0],
                  saturation: responseValue[1],
                  value: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'object' && node.output === 'rgb') {
                var obj = {
                  red: responseValue[0],
                  green: responseValue[1],
                  blue: responseValue[2]
                };
                responseValue = obj;
              } else if (node.outputType === 'string' && node.output != "css" && node.output != "hex") {
                var str = responseValue.join(',');
                responseValue = str;
              }
              else if (node.outputType === 'string' && node.output === "hex") {
                var str = responseValue
                responseValue = str;
              }
            }
          } else {
            if (done) {
              done("Input not an array")
            } else {
              node.error("Input not an array", msg);
            }
            return;
          }
          break;
        case 'css':
          if (typeof input === 'string') {
            switch(node.output){
              case 'rgb':
                responseValue = convertColor.keyword.rgb(input);
                break;
              case 'hsl':
                responseValue = convertColor.keyword.hsl(input);
                break;
              case 'hsv':
                responseValue = convertColor.keyword.hsv(input);
                break;
              case 'hex':
                responseValue = '#'+convertColor.keyword.hex(input);
                break;
            }
          }
          break; 
        case 'hex':
          if (typeof input === 'string') {
            switch(node.output){
              case 'rgb':
                responseValue = convertColor.hex.rgb(input);
                break;
              case 'hsl':
                responseValue = convertColor.hex.hsl(input);
                break;
              case 'hsv':
                responseValue = convertColor.hex.hsv(input);
                break;
              case 'css':
                responseValue = convertColor.hex.keyword(input);
                break;
            } 
          } else {
            if (done) {
              done("Input not a string")
            } else {
              node.error("Input not a string", msg);
            }
            return;
          }
          break;
      }

      if (responseValue) {
        msg.payload = responseValue;
        send(msg);
        if (done) {
          done()
        }
      } else {
        if (done) {
          done("no output, normally means bad input")
        } else {
          node.error("no output, normally means bad input", msg);
        }
      }
    });
  }
  RED.nodes.registerType("color-convert",convert);
}
