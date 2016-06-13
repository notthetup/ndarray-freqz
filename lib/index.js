'use strict';

var zeros = require("zeros");
var fill = require("ndarray-fill");
var horner = require("horner");
var isnd = require('isndarray')
var ndarray = require("ndarray");
var cops = require("ndarray-complex");
var ops = require("ndarray-ops");


function createOmega(num) {
    var omega = zeros([num]);
    fill(omega, function(i, j) {
        return Math.PI / num * i;
    });

    return omega;
}

/*
 * Given the numerator b and denominator a of a digital filter, compute its frequency response
 */
function freqz(b, a, omega) {

    if (!b) {
        b = zeros([0]);
    }

    if (!a) {
        a = zeros([0]);
    }

    if (Array.isArray(omega)) {
        omega = ndarray(omega);
    } else if (!isNaN(omega)) {
        omega = createOmega(omega);
    } else if (!isnd(omega)) {
        omega = createOmega(512);
    }

    if (!isnd(b)) {
        b = ndarray(b);
    }

    if (!isnd(a)) {
        a = ndarray(a);
    }

    var z_r = zeros(omega.shape);
    var z_i = zeros(omega.shape);

    var omega_r = zeros(omega.shape);
    var omega_i = zeros(omega.shape);

    ops.neg(omega_i, omega);
    cops.exp(z_r, z_i, omega_r, omega_i);

    var H_r = zeros(omega.shape);
    var H_i = zeros(omega.shape);

    var Num_r = zeros(omega.shape);
    var Num_i = zeros(omega.shape);

    var Den_r = zeros(omega.shape);
    var Den_i = zeros(omega.shape);


    for (var index = 0; index < omega.shape[0]; index++) {
        var this_z = [z_r.get(index, 1), z_i.get(index, 1)];
        var num = horner(b.data, this_z);
        var den = horner(a.data, this_z);

        Num_r.set(index, num[0]);
        Num_i.set(index, num[1]);

        Den_r.set(index, den[0]);
        Den_i.set(index, den[1]);
    }

    cops.div(H_r, H_i, Num_r, Num_i, Den_r, Den_i);

    return {
        omega: omega,
        H_r: H_r,
        H_i: H_i
    }
}

module.exports = freqz;
