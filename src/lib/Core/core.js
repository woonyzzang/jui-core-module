import {global, doc, LIB_NAME as core} from '../config';
import {debug} from '../Native/debug';
import {isType} from '../Native/isType';
// import {isPlainObject} from '../Native/isPlainObject';
// import {isArray} from '../Native/isArray';
// import {isFunction} from '../Native/isFunction';
// import {isObject} from '../Native/isObject';
import {each} from '../Native/each';
import {reverse} from '../Native/reverse';
import {extend} from '../Native/extend';
import {clone} from '../Native/clone';

if (global[core]) { throw new Error('The same core name exists.'); }
// if (!global['$']) { throw new Error('This library requires jQuery'); }

/**
 * @namespace
 * @name Core
 * @description 루트 네임스페이스 식별자
 */
let Core = global[core] || (global[core] = {});

/** 라이브러리 기본 코어 */
extend(Core, {
    constructor: core, // 생성자(프레임워크) 이름
    version: 'v1.0.0',
    debug: debug, // 디버깅 로그
    each: each, // 반복함수
    reverse: reverse, // 역순 반복함수
    extend: extend, // 객체 병합함수
    clone: clone, // 객체 복제함수
    emptyFn: function() {}, // 빈 함수

    /**
     * @name {{LIB_NAME}}.noConflict
     * @description 코어 네이밍 식별자 변경 (다른 자바스크립트 프레임워크 네이밍 충돌 방지)
     * @example
     * var JUILIB = {{LIB_NAME}}.noConflict();
     */
    noConflict: function() {
        global[core] = undefined;

        return this;
    },

    /**
     * @name {{LIB_NAME}}.tmpInput
     * @description 특정속성을 지원하는지 체크하기 위한 엘리먼트
     * @example
     * if ('placeholder' in {{LIB_NAME}}.tmpInput) {
     *     alert('placeholder를 지원합니다.');
     * }
     */
    tmpInput: doc.createElement('input'),

    /**
     * @name {{LIB_NAME}}.tmpNode
     * @description 특정 css스타일을 지원하는지 체크하기 위한 엘리먼트
     * @example
     * if ('transform' in {{LIB_NAME}}.tmpNode.style) {
     *     alert('transform를 지원합니다.');
     * }
     */
    tmpNode: doc.createElement('div'),

    /**
     * @name {{LIB_NAME}}.is
     * @description 타입 체크
     */
    is: isType,

    /**
     * @name {{LIB_NAME}}.isEmpty
     * @description 주어진 인자가 빈값인지 체크
     * @param {*} value - 체크할 값(문자열, 객체 등등)
     * @param {Boolean} [allowEmptyString = false] - 빈문자를 허용할 것인지 여부
     * @return {Boolean} 빈값인지 체크 후 불린값 반환
     * @example
     * {{LIB_NAME}}.isEmpty(null); // true
     * {{LIB_NAME}}.isEmpty(undefined); // true
     * {{LIB_NAME}}.isEmpty(''); // true
     * {{LIB_NAME}}.isEmpty(0); // true
     * {{LIB_NAME}}.isEmpty([]); // true
     * {{LIB_NAME}}.isEmpty({}); // true
     */
    isEmpty: (value, allowEmptyString) => {
        return (typeof value === null)
            || (typeof value === 'undefined')
            || (value === 0)
            || (Core.is(value, 'string') && !(allowEmptyString)? value === '' : false)
            || (Core.is(value, 'array') && value.length === 0)
            || (Core.is(value, 'object') && !Core.object.hasObject(value));
    },

    /**
     * @name {{LIB_NAME}}.hasOwn
     * @description 객체 자체에 주어진 이름의 속성이 있는지 조회
     * @param {Object} obj - 객체
     * @param {String} name - 키 이름
     * @return {Boolean} 키의 존재 여부
     * @example
     * var obj = {a: 'A'};
     * if ({{LIB_NAME}}.hasOwn(obj, 'a')) {
     *     alert('obj객체에 a가 존재합니다.');
     * }
     */
    hasOwn: (obj, name) => {
        return Object.prototype.hasOwnProperty.call(obj, name);
    },

    /**
     * @name {{LIB_NAME}}.namespace
     * @description 네임스페이스 공간을 생성하고 객체를 설정하며 .를 구분자로 하여 하위 네임스페이스가 생성된다.
     * @param {String} part - 네임스페이스명
     * @param {Object|Function} [obj] - 지정된 네임스페이스에 등록할 객체, 함수 등
     * @return {Object} 생성된 새로운 네임스페이스
     * @example
     * {{LIB_NAME}}.namespace('app.ui.Module', Module);
     * // 를 native로 풀면,
     * var app = {
     *     ui: {
     *         Module: Module
     *     }
     * };
     */
    // namespace: (part, obj) => {
    //     if (typeof part !== 'string') {
    //         obj && (part = obj);
    //
    //         return part;
    //     }
    //
    //     let parent = Core,
    //         parts = part.split('.'),
    //         i, item;
    //
    //     for (i = -1; item = parts[++i];) {
    //         if (parent[item]) { throw new Error('The same core namespace exists.'); } // 기본 네임스페이스 이름 생성시 에러 반환
    //
    //         parent = parent[item] || (parent[item] = {});
    //     }
    //
    //     return Core.extend(parent, obj || {});
    // },

    /**
     * @name {{LIB_NAME}}.dependency
     * @description 의존성 모듈 패턴
     * @example
     * // device 모듈 추가
     * {{LIB_NAME}}.dependency.module.device = function(app) {
     *    app.deviceChk = function() {
     *        console.log('deviceChk');
     *    };
     *    app.isMobile = function() {
     *        console.log('isMobile');
     *    };
     * };
     * // os 모듈 추가
     * {{LIB_NAME}}.dependency.module.os = function(app) {
     *    app.isFlatForm = function(viewType, callback) {
     *        console.log('isFlatForm');
     *    };
     * };
     *
     * // 추가된 모듈 사용
     * {{LIB_NAME}}.dependency(['*'], function(Module) {}); // 의존성 모듈 전체 사용
     * {{LIB_NAME}}.dependency(function(Module) {}); // 의존성 모듈 생략 가능
     * {{LIB_NAME}}.dependency(['device', 'os'], function(Module) {
     *     console.log(Module); // {device, os} 추가한 모듈 객체가 인자로 들어온다.
     *     Module.deviceChk(); // 추가한 모듈의 메소드, 프로퍼티 사용
     * });
     *
     * // 코어 별칭 모듈 추가 단축 네이밍: module
     * {{LIB_NAME}}.module.os = function(app) {});
     * // 코어 별칭 모듈 사용 단축 네이밍: modules
     * {{LIB_NAME}}.modules(['*'], function(Module) {});
     */
    // dependency: function() {
    //     const args = Array.prototype.slice.call(arguments),
    //         callback = args.pop();
    //     let modules = (args[0] && (typeof args[0] === 'string'))? args : args[0];
    //
    //     if (!(this instanceof Core.dependency)) {
    //         return new Core['dependency'](modules, callback);
    //     }
    //
    //     // 모듈선언이 생략되거나 전체선택자일 경우
    //     if (!modules || modules === '*' || modules[0] === '*') {
    //         modules = [];
    //         const ref = Core.dependency.module;
    //
    //         for (let k in ref) {
    //             if (Core.dependency.module.hasOwnProperty(k)) {
    //                 modules.push(k);
    //             }
    //         }
    //     }
    //
    //     for (let i = 0, len = modules.length; i < len; i++) {
    //         Core.dependency.module[modules[i]](this);
    //     }
    //
    //     if ((typeof callback !== 'undefined') && (typeof callback === 'function')) {
    //         return callback(this);
    //     }
    // },

    /**
     * @name {{LIB_NAME}}.bindjQuery
     * @description 작성된 클래스를 jQuery의 플러그인으로 사용할 수 있도록 바인딩시켜 주는 함수
     * @param {Object} Klass 클래스
     * @param {string} name 플러그인명
     * @example
     * // 클래스 정의
     * var Highlight = {{LIB_NAME}}.Class({
     *     _constructor: function(selecter, options) { // 생성자의 형식을 반드시 준수 (첫번째 인수: 대상 엘리먼트, 두번째 인수: 옵션값들)
     *         var settings = $.extend({
     *              color: 'red',
     *              backgroundColor: 'yellow'
     *          }, options);
     *
     *          this.render(selecter, settings);
     *     },
     *     render: function(selecter, settings) {
     *          $(selecter).css({
     *              color: settings.color,
     *              backgroundColor: settings.backgroundColor
     *          });
     *      }
     * });
     * {{LIB_NAME}}.bindjQuery(Highlight, 'highlight'); // jQuery 바인딩 선언
     * $('body').highlight({color: 'blue', backgroundColor: 'green'}); // jQuery 바인딩 사용
     */
    //  bindjQuery: function(className, bindName) {
    //      if (typeof jQuery == 'undefined') { throw new Error('This library requires jQuery'); }
    //
    //      const TypeClass = Core.emptyFn;
    //
    //      TypeClass.prototype = new className;
    //      TypeClass.prototype.constructor = TypeClass;
    //
    //      $.fn[bindName] = function(options) {
    //          const _this = this;
    //
    //          Core.each(this, function(index) {
    //              if (Core.is(options, 'string')) { // 단일 메소드 실행
    //                  new className()[options].apply(TypeClass, Array.prototype.slice.call(arguments, 1));
    //              } else {
    //                  className.apply(new TypeClass, [_this, options]);
    //              }
    //          });
    //
    //          return this;
    //     };
    // }
    // bindjQuery: function(Klass, name, prefix) {
    //     if (typeof jQuery == 'undefined') { throw new Error('This library requires jQuery'); }
    //
    //     var pluginName = (prefix)? prefix + name.substr(0, 1).toUpperCase() + name.substr(1) : name,
    //         old = $.fn[pluginName];
    //
    //     $.fn[pluginName] = function(options) {
    //         var args = Array.prototype.slice.call(arguments, 1),
    //             _this = this,
    //             returnValue = _this;
    //
    //         this.each(function() {
    //             var $this = $(this),
    //                 methodValue,
    //                 instance = $this.data('ui_' + name);
    //
    //             if (instance && options === 'release') {
    //                 try {
    //                     instance.release();
    //                 } catch (e) {}
    //
    //                 $this.removeData('ui_' + name);
    //
    //                 return;
    //             }
    //
    //             if (!instance || (arguments.length === 1 && typeof options !== 'string')) {
    //                 instance && (instance.release(), $this.removeData('ui_' + name));
    //                 $this.data('ui_' + name, (instance = new Klass(this, Core.extend({}, $this.data(), options), _this)));
    //             }
    //
    //             if (options === 'instance') {
    //                 returnValue = instance;
    //
    //                 return false;
    //             }
    //
    //             if (typeof options === 'string' && Core.is(instance[options], 'function')) {
    //                 if (options.substr(0, 1) === '_') {
    //                     throw new Error('[bindjQuery] private 메소드는 호출할 수 없습니다.');
    //                 }
    //
    //                 try {
    //                     methodValue = instance[options].apply(instance, args);
    //                 } catch (e) {
    //                     console.error('[' + name + '.' + options + ' error] ' + e);
    //                 }
    //
    //                 if (methodValue !== instance && typeof methodValue !== 'undefined') {
    //                     returnValue = methodValue;
    //
    //                     return false;
    //                 }
    //             }
    //         });
    //
    //         return returnValue;
    //     };
    //
    //     // 기존의 모듈로 복구
    //     $.fn[pluginName].noConflict = function() {
    //         $.fn[pluginName] = old;
    //
    //         return this;
    //     };
    // }

    /**
     * @name {{LIB_NAME}}.define
     * @description 코어 하위 name에 해당하는 네임스페이스를 생성하여 object를 설정해주는 함수
     * @param {String} part - .를 구분자로 해서 {{LIB_NAME}}을 시작으로 하위 네임스페이스를 생성하며 part가 없으면 {{LIB_NAME}}에 추가된다.
     * @param {Object|Function} obj - 지정된 네임스페이스에 등록할 객체, 함수 등
     * @return {Object} 생성된 새로운 네임스페이스
     * @example
     * {{LIB_NAME}}.define('urls', {
     *     store: 'Store',
     *     company: 'Company'
     * });
     * alert({{LIB_NAME}}.urls.store);
     * alert({{LIB_NAME}}.urls.company);
     */
    define: (part, obj, isExecFn) => {
        if (typeof part !== 'string') {
            obj = part;
            part = '';
        }

        let parent = Core,
            parts = (part)? part.replace(/^_core\.?/, '').split('.') : [],
            ln = parts.length - 1,
            leaf = parts[ln];

        if (isExecFn !== false && (typeof obj === 'function') && !Core.hasOwn.call(obj, 'superclass')) {
            obj = obj.call(parent);
        }

        for (let i = 0; i < ln; i++) {
            parent = parent[parts[i]] || (parent[parts[i]] = {});
        }

        return ((leaf && (parent[leaf])? Core.extend(parent[leaf], obj) : (parent[leaf] = obj))) || Core.extend(parent, obj), obj;
    }
});

/** 코어 별칭 */
Core.name = Core.constructor;
// Core.ver = Core.version;
// Core.ns = Core.namespace;
// Core.modules = Core.dependency;
// Core.module = Core.dependency.module = {};

export {Core};
