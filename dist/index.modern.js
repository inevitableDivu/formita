import { useState, useMemo, useCallback, useEffect } from 'react';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Asynchronously await a promise and pass the result to a finally continuation
function _finallyRethrows(body, finalizer) {
	try {
		var result = body();
	} catch (e) {
		return finalizer(true, e);
	}
	if (result && result.then) {
		return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	}
	return finalizer(false, result);
}

function validate(value, type) {
  if (value.length === 0) return {
    message: 'Input field cannot be empty'
  };
  if (type === 'email') {
    var check = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/g;
    if (check.test(value)) return null;else return {
      message: 'Invalid e-mail entered'
    };
  }
  if (type === 'password') {
    if (value.length < 6) return {
      message: 'Password must contain atleat 6 characters'
    };
  }
  return null;
}
function useFormita(params) {
  var _useState = useState(false),
    loading = _useState[0],
    setLoading = _useState[1];
  var _useState2 = useState(false),
    disabled = _useState2[0],
    setDisabled = _useState2[1];
  var formData = useMemo(function () {
    var obj = _extends({}, params);
    var newObj = {};
    Object.keys(obj).map(function (key) {
      var _newObj, _objChild$value, _extends2;
      var index = key;
      var objChild = obj[index];
      newObj = _extends({}, (_newObj = newObj) != null ? _newObj : {}, (_extends2 = {}, _extends2[index] = _extends({}, obj[index], {
        value: (_objChild$value = objChild.value) != null ? _objChild$value : '',
        type: objChild.type
      }), _extends2));
    });
    return newObj;
  }, []);
  var _useState3 = useState(formData),
    form = _useState3[0],
    setForm = _useState3[1];
  var handleChange = useCallback(function (target) {
    var formTarget = form[target];
    var limit = formTarget.type === 'number' ? formTarget.limit : 1;
    return function (text) {
      var error = null;
      if (formTarget.type === 'email' || formTarget.type === 'password') {
        error = validate(String(text), formTarget.type);
      }
      if (formTarget.type === 'text') {
        error = String(text).length < 1 ? {
          message: 'Input field cannot be empty!'
        } : null;
      }
      if (formTarget.type === 'number') {
        if (text === '') {
          error = {
            message: 'Input field cannot be empty!'
          };
        } else if (isNaN(Number(text))) {
          error = {
            message: 'Invalid data provided!'
          };
        } else if (String(text).length > limit) {
          error = {
            message: 'Invalid length of characters!'
          };
        }
      }
      setForm(function (data) {
        var _extends3;
        return _extends({}, data, (_extends3 = {}, _extends3[target] = _extends({}, data[target], {
          value: text,
          error: error
        }), _extends3));
      });
      return error;
    };
  }, [form]);
  var handleOnSubmit = useCallback(function (cb, errorCallback, complete) {
    return function () {
      try {
        return Promise.resolve(_finallyRethrows(function () {
          return _catch(function () {
            setLoading(true);
            var error = Object.keys(form).find(function (item) {
              return Boolean(form[item].error);
            });
            var errorIndex = Object.keys(form).find(function (item) {
              return String(form[item].value).length < 1;
            });
            if (error) {
              console.log(error);
              return;
            }
            if (errorIndex) {
              setForm(function (old) {
                var _extends4;
                return _extends({}, old, (_extends4 = {}, _extends4[errorIndex] = _extends({}, old[errorIndex], {
                  error: {
                    message: 'Input field cannot be empty!'
                  }
                }), _extends4));
              });
              return;
            }
            return Promise.resolve(cb(form)).then(function () {});
          }, function (error) {
            var _error$response, _error$response2;
            var message = typeof (error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data) === 'string' ? error.response.data : typeof (error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data) === 'object' ? error.response.data.message : error.message;
            errorCallback === null || errorCallback === void 0 ? void 0 : errorCallback({
              message: message
            });
          });
        }, function (_wasThrown, _result) {
          complete === null || complete === void 0 ? void 0 : complete();
          setLoading(false);
          if (_wasThrown) throw _result;
          return _result;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }, [form]);
  useEffect(function () {
    var check = Object.keys(form).find(function (item) {
      return Boolean(form[item].error);
    });
    if (check) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [form]);
  return {
    handleChange: handleChange,
    form: form,
    handleOnSubmit: handleOnSubmit,
    loading: loading,
    disabled: disabled
  };
}

export { useFormita, validate };
//# sourceMappingURL=index.modern.js.map
