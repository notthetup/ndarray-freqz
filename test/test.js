var ndarray = require("ndarray");
var tape = require("tape");
var cwise = require("cwise");
var zeros = require("zeros");
var cops = require("ndarray-complex");


var freqz = require('../lib');


// Generate Random input data;
var a_size = parseInt(Math.random() * 20);
var b_size = parseInt(Math.random() * 20);
var omega_size = parseInt(Math.random() * 200);

var a_array = [];
var b_array = [];
var omega_array = [];

for (var index = 0; index < a_size; index++) {
  a_array.push((Math.random() - 0.5) * 10);
}

for (var index = 0; index < b_size; index++) {
  b_array.push((Math.random() - 0.5) * 10);
}

for (var index = 0; index < omega_size; index++) {
  omega_array.push(Math.PI / omega_size * index);
}


var a_nd = ndarray(a_array);
var b_nd = ndarray(b_array);
var omega_nd = ndarray(omega_array);


// Known values for functional test;

var a = [0.00685858, 0.00424427, 0.01363637, 0.00939893, 0.01363637,
  0.00424427, 0.00685858
]

var b = [1., -3.6133816, 6.29949582, -6.44744259, 4.04658649, -1.4649745, 0.23927553]

var omega = [0.1, 0.2, 0.3, 0.4, 0.5];

var H_r = [0.9273833, 0.68302768, 0.304890954, -0.15711188, -0.6193361];
var H_i = [0.3951480, 0.7326551, 0.95308707, 0.99499834, 0.79966865];

freqz(b_array, a_array);

var almostEqual = cwise({
  args: ["array", "array", "scalar", "scalar"],
  body: function(a, b, absoluteError, relativeError) {
    var d = Math.abs(a - b)
    if (d > absoluteError && d > relativeError * Math.min(Math.abs(a), Math.abs(b))) {
      console.log('false', a, b);
      return false
    }
  },
  post: function() {
    return true
  }
});

tape("Input - b/a Array", function(t) {
  t.doesNotThrow(function() {
    freqz(b_array, a_array);
  });
  t.end();
});

tape("Input - b/a ndarray", function(t) {
  t.doesNotThrow(function() {
    freqz(b_nd, a_nd);
  });
  t.end();
});

tape("Input - b/a Mixed (ndarray & Array)", function(t) {
  t.doesNotThrow(function() {
    freqz(b_array, a_nd);
  });
  t.end();
});


tape("Input - No a", function(t) {
  t.doesNotThrow(function() {
    freqz(b_array);
  });
  t.end();
});


tape("Input - No omega", function(t) {
  t.doesNotThrow(function() {
    H = freqz(b_nd, a_array);
  });
  t.equal(H.omega.data.length, 512);
  t.end();
});

tape("Input - Number omega", function(t) {
  t.doesNotThrow(function() {
    H = freqz(b_nd, a_nd, 20);
  });
  t.equal(H.omega.data.length, 20);
  t.end();
});

tape("Input - Array omega", function(t) {
  t.doesNotThrow(function() {
    H = freqz(b_nd, a_nd, omega_array);
  });
  t.equal(H.omega.data, omega_array);
  t.end();
});

tape("Input - ndarray omega", function(t) {
  t.doesNotThrow(function() {
    H = freqz(b_nd, a_nd, omega_nd);
  });
  t.end();
});


tape("Function - IIR Filter", function(t) {
  t.doesNotThrow(function() {
    H = freqz(b, a, omega);
  });
  t.ok(almostEqual(H.omega, ndarray(omega), 1e-6, 1e-6));
  t.ok(almostEqual(H.H_r, ndarray(H_r), 1e-4, 1e-4));
  t.ok(almostEqual(H.H_i, ndarray(H_i), 1e-4, 1e-4));
  t.end();
});

tape("Function - Magnitude", function(t) {
  t.doesNotThrow(function() {
    var b = [0.5, 0.5];
    var a = [1];

    var fr = freqz(b, a);

    fr.H_r // real part of the frequency response.
    fr.H_i // imaginary part of the frequency response.

    var magnitude = zeros([512])

    cops.mag(magnitude, fr.H_r, fr.H_i);
  });
  t.end();
});
