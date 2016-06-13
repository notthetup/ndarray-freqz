# ndarray-freqz

Compute the frequency response of a digital filter based on it's transfer function.


## Introduction

This [scijs](http://scijs.net) compatible module calculates the frequency response of a given transfer function, described by the coefficient of the numerator and denominator polynomials.

```
|           jw              -jw            -jmw
|    jw  B(e)    b[0] + b[1]e + .... + b[m]e
| H(e) = ---- = ------------------------------------
|          jw               -jw            -jnw
|        A(e)    a[0] + a[1]e + .... + a[n]e
```


Inspired by the [scipy.signal.freqz](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.freqz.html) function.

Sample usage:

```javascript
var freqz = require('ndarray-freqz')

var b = [0.5, 0.5];
var a = [1];

var fr = freqz(b, a);

fr.H_r // real part of the frequency response.
fr.H_i // imaginary part of the frequency response.

var magnitude = zeros([512])

cops.mag(magnitude, fr.H_r, fr.H_i);

```


## Install

```sh
$ npm install ndarray-freqz
```


## API

### `freqz( b, a, [omega] )`
Compute the frequency response of a digital filter based on it's transfer function.

* `b` __Array/ndarray__ of the numerator polynomial coefficients of the filter transfer function.
* `a` __Array/ndarray__ of the denominator polynomial coefficients of the filter transfer function.
* `omega` Optional __Array/ndarray__ of frequency (in radians/sample) values to calculate the frequency response for. If the value is a __Number__, then frequency response will be calculated for that many frequencies equally spaced around the unit circle. If __undefined__ then frequency response will be calculated at 512 frequencies equally spaced around the unit circle.

**Returns** a object with following components

* `H_r` __ndarray__ of the real part of the generated frequency response.
* `H_i` __ndarray__ of the imaginary part of the generated frequency response.
* `omega` __ndarray__ of the frequencies of the generated frequency response.


## Credits

(c) 2016 Chinmay Pendharkar. MIT License
