// JavaScript Document
/**
 * 作者：亮
 * 主要是对色彩转换的收集整理，部分色彩转换算法非作者编写，仅仅进行修改或改写
 **/
(function($, window) {
  "use strict";
  /**
   * 色彩
   **/
  var MColor : {
    lastUpdate : '2016-11-17 14:44:05',
    /**
     * 通过色彩名称返回Hue色调
     **/
    getHueFromText: function(text){
      var h = '';
      switch(text){
        case '红':
          var r = M.other.genRandom(0, 100);
          if (r >= 50){
            h = M.other.genRandom(0, 30);
          } else {
            h = M.other.genRandom(330, 359);
          }
          break;
        case '黄':
          h = M.other.genRandom(30, 90);
          break;
        case '绿':
          h = M.other.genRandom(90, 150);
          break;
        case '青':
          h = M.other.genRandom(150, 210);
          break;
        case '蓝':
          h = M.other.genRandom(210, 270);
          break;
        case '紫':
          h = M.other.genRandom(270, 330);
          break;
      }
      return h;
    },
    /**
     * 通过HSV、HSL色相环转换色彩名称
     */
    colorName: function(hsv){
      var colorName = [],
        h = hsv[0] ? hsv[0] : 0,
        s = hsv[1] ? hsv[1] : 0,
        v = hsv[2] ? hsv[2] : 0;

      colorName['depth'] =  v >= 60 ? '浅' : '深';
      colorName['brightness'] = v >= 50 ? '明亮' : '深暗';

      if (v == 0) {
        colorName['main'] = '黑';
        colorName['sub'] = '黑';
      } else if(s == 0 && v == 100) {
        colorName['main'] = '白';
        colorName['sub'] = '白';
      } else if(s == 0) {
        colorName['main'] = '灰';
        colorName['sub'] = '灰';
      } else if ( h <= 30 ) {
        colorName['main'] = '红';
        if (h <= 10){
            colorName['sub'] = '红';
        } else if (h <= 20){
          colorName['sub'] = '橘红';
        } else {
          colorName['sub'] = '橙';
        }
      } else if ( h > 30 && h <= 90 ) {
        colorName['main'] = '黄';
        if (h < 40){
            colorName['sub'] = '橙';
        } else if ( h < 50){
          colorName['sub'] = '橘黄';
        } else if( h > 70 ) {
          colorName['sub'] = '绿黄';
        } else {
          colorName['sub'] = '黄';
        }
      } else if ( h > 90 && h <= 150 ) {
        colorName['main'] = '绿';
        if ( h < 110){
          colorName['sub'] = '黄绿';
        } else if( h > 130 ) {
          colorName['sub'] = '青绿';
        } else {
          colorName['sub'] = '绿';
        }
      } else if ( h > 150 && h <= 210 ) {
        colorName['main'] = '青';
        if ( h < 170){
          colorName['sub'] = '绿青';
        } else if(h > 190) {
          colorName['sub'] = '蓝青';
        } else {
          colorName['sub'] = '青';
        }
      } else if ( h > 210 && h <= 270 ) {
        // 220 - 260
        colorName['main'] = '蓝';
        if ( h < 230){
          colorName['sub'] = '青蓝';
        } else if(h > 250) {
          colorName['sub'] = '紫蓝';
        } else {
          colorName['sub'] = '蓝';
        }
      } else if ( h < 330 ) {
        colorName['main'] = '紫';
        if ( h < 290){
          colorName['sub'] = '蓝紫';
        } else if(h > 310){
          colorName['sub'] = '红紫';
        } else {
          colorName['sub'] = '紫';
        }
      } else {
        colorName['main'] = '红';
        if ( h < 350){
          colorName['sub'] = '紫红';
        } else {
          colorName['sub'] = '红';
        }
      }
      // 增加灰色
      if (colorName['main'] != '黑' && colorName['main'] != '白' && colorName['main'] != '灰'){
        if (s < 10){
              colorName['sub'] = '灰'+colorName['sub'];
          }
      }
      return colorName;
    },

    /**
     * HEX 转 RGB
     * @param string hex, #fff;
     * @return array;
     **/
    hex2rbg : function(hex){
      hex = hex.charAt(0) === "#" ? hex.substring(1, 7) : hex;
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);
      return [r, g ,b];
    },
    /**
     * RGB 转 RYB
     * @param arry rgb, [255,255,255];
     * @return array;
     **/
    rgb2ryb: function(rgb){
      var r = rgb[0],
      g = rgb[1],
      b = rgb[2];

      var w = Math.min(r, g, b);
      r -= w;
      g -= w;
      b -= w;

      var mg = Math.max(r, g, b);

      // Get the yellow out of the red+green.
      var y = Math.min(r, g);
      r -= y;
      g -= y;

      // If this unfortunate conversion combines blue and green, then cut each in
      // half to preserve the value's maximum range.
      if (b && g) {
        b /= 2.0;
        g /= 2.0;
      }

      // Redistribute the remaining green.
      y += g;
      b += g;

      // Normalize to values.
      var my = Math.max(r, y, b),
        n = '';
      if (my) {
        n = mg/my;
        r *= n;
        y *= n;
        b *= n;
      }

      // Add the white back in.
      r += w;
      y += w;
      b += w;

      // And return back the ryb typed accordingly.
      return [255-r, 255-y, 255-b];
    },
    /**
     * HEX 转 CMYK;
     * @param string hex, #fff;
     * @return array;
     **/
    hex2cmyk : function(hex) {
      var computedC = 0;
      var computedM = 0;
      var computedY = 0;
      var computedK = 0;

      hex = (hex.charAt(0)==="#") ? hex.substring(1,7) : hex;

      if (hex.length !== 6) {
        alert ('HEX 长度无效!');
        return;
      }
      if (/[0-9a-f]{6}/i.test(hex) !== true) {
        alert ('无效的的 HEX 数字!');
        return;
      }

      var r = parseInt(hex.substring(0,2),16);
      var g = parseInt(hex.substring(2,4),16);
      var b = parseInt(hex.substring(4,6),16);

      // BLACK
      if (r===0 && g===0 && b===0) {
        computedK = 1;
        return [0,0,0,1];
      }

      computedC = 1 - (r/255);
      computedM = 1 - (g/255);
      computedY = 1 - (b/255);

      var minCMY = Math.min(computedC,Math.min(computedM,computedY));

      computedC = (computedC - minCMY) / (1 - minCMY) ;
      computedM = (computedM - minCMY) / (1 - minCMY) ;
      computedY = (computedY - minCMY) / (1 - minCMY) ;
      computedK = minCMY;

      return [computedC,computedM,computedY,computedK];
    },

    /**
     * HEX 转 HSL;
     * @param string hex, #fff;
     * @return array;
     **/
    hex2hsl : function(hex) {
    },

    /**
     * HEX 转 HSV(B);
     * @param string hex, #fff;
     * @return array;
     **/
    hex2hsv : function(hex) {
      var rgb = this.hex2rbg(hex);
      return this.rgb2hsv(rgb);
    },

    /**
     * Hex 转 XYZ
     **/
    hex2xyz : function(){
    },

    /**
     * RGB 转 HSV
     * @param array rgb, [r,g,b]
     * @return array [h,s,v]
     **/
    rgb2hsv: function ( rgb ) {
      var r = rgb[ 0 ],
        g = rgb[ 1 ],
        b = rgb[ 2 ],
        min = Math.min( r, g, b ),
        max = Math.max( r, g, b ),
        delta = max - min,
        h, s, v;
      if ( max === 0 ) {
        s = 0;
      } else {
        s = ( delta / max * 100 );
      }
      if ( max === min ) {
        h = 0;
      } else if ( r === max ) {
        h = ( g - b ) / delta;
      } else if ( g === max ) {
        h = 2 + ( b - r ) / delta;
      } else if ( b === max ) {
        h = 4 + ( r - g ) / delta;
      }
      h = Math.min( h * 60, 360 );
      if ( h < 0 ) {
        h += 360;
      }
      v = ( ( max / 255 ) * 1000 ) / 10;
      return [ h, s, v ];
    },
    hsv2hex: function(hsv){
      var rgb = this.hsv2rgb(hsv);
      return this.rgb2hex(rgb);
    },
    /**
     * HSV 转 RGB
     * @param int hue;
     * @param int saturation;
     * @param int value;
     * @return array rgb [r,g,b];
     **/
    hsv2rgb : function(hsv){
      var h = hsv[0],
          s = hsv[1],
          v = hsv[2];
      h = h / 60;
      s = s / 100;
      v = v / 100;
      var hi = Math.floor(h) % 6;

      var f = h - Math.floor(h);
      var p = 255 * v * (1 - s);
      var q = 255 * v * (1 - (s * f));
      var t = 255 * v * (1 - (s * (1 - f)));
      v *= 255;

      switch(hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    },

    /**
     * RGB 转 HEX
     * @param int r;
     * @param int g;
     * @param int b;
     **/
    rgb2hex : function(rgb){
      var r = rgb[0],
        g = rgb[1],
        b = rgb[2];
      var r = (r<0 ? 0 : (r>255 ? 255 : r)).toString(16),
      g = (g<0 ? 0 : (g>255 ? 255 : g)).toString(16),
      b = (b<0 ? 0 : (b>255 ? 255 : b)).toString(16);
      var color = (r.length < 2 ? '0' : '')+r;
      color += (g.length < 2 ? '0' : '')+g;
      color += (b.length < 2 ? '0' : '')+b;
      return color.toUpperCase();
    }
  }
  if (typeof define === 'function' && define.amd) {
      define(function () {
        return MColor
      })
    } else if (typeof module === 'object' && module.exports) {
      module.exports = MColor
    } else {
      window.MColor = MColor;
    }
})($, window);

console.log('https://github.com/520internet/MColor');
