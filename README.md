# NODE-RED-CONTRIB-COLOR-CONVERT

## Install

Install via the pallet manager or by running the following in the Node-RED user directory 
(usually ~/.node-red):

`npm install node-red-contrib-color-convert`

## Usage

This node converts between different color representations, it can convert between the following systems.

 - RGB - Red, Green, Blue
 - HSL - Hue, Saturation, Level
 - HSV - Hue, Saturation, Value (brightnes)
 - CSS - CSS color names
 - HEX - A Hex RGB string #ff00ff

### Inputs

For the first 3 input modes the node will attempt to determine the input format of msg.payload from the 3 following:

 - a 3 segment array with values between 0-255 for RGB.
 - a 3 segment array for HSL and HSV with Hue is between 0-360 and Saturation, Level, values 0-100.
 - a object with keys red,green,blue with values between 0-255.
 - a object with keys hue,saturation,lightness or value,brightness with values between 0-360 for hue and 0-100 for the others.

For the CSS or HEX input mode the msg.payload should be a string containing the name of a CSS color.

For HSV and HSL inputs the "Scale Sat/Bri/Val" check box will convert values from 0-1 to 0-100

### Outputs

Output type can be configured to be either a 3 element array, an object or a string. The 3 element array will contian the 
aproprate values in the same order as expected. Objects will have matching keys and the string will be the values from the 
array joined with a comma.

If the CSS or HEX output mode is selected then the output type will be forced to be a string.