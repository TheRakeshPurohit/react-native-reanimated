(window.webpackJsonp=window.webpackJsonp||[]).push([[148],{203:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return d}));var a=n(2),r=n(6),i=(n(0),n(300)),o={id:"useAnimatedGestureHandler",title:"useAnimatedGestureHandler",sidebar_label:"useAnimatedGestureHandler"},l={id:"version-2.0.0-alpha.9/api/useAnimatedGestureHandler",title:"useAnimatedGestureHandler",description:"This hook allows for defining worklet handlers that can serve in a process of handling gestures.",source:"@site/versioned_docs/version-2.0.0-alpha.9/api/useAnimatedGestureHandler.md",permalink:"/react-native-reanimated/docs/2.0.0-alpha.9/api/useAnimatedGestureHandler",editUrl:"https://github.com/software-mansion/react-native-reanimated/tree/master/docs/versioned_docs/version-2.0.0-alpha.9/api/useAnimatedGestureHandler.md",version:"2.0.0-alpha.9",sidebar_label:"useAnimatedGestureHandler",sidebar:"version-2.0.0-alpha.9/docs",previous:{title:"useAnimatedScrollHandler",permalink:"/react-native-reanimated/docs/2.0.0-alpha.9/api/useAnimatedScrollHandler"},next:{title:"useAnimatedRef",permalink:"/react-native-reanimated/docs/2.0.0-alpha.9/api/useAnimatedRef"}},s=[{value:"Arguments",id:"arguments",children:[]},{value:"Returns",id:"returns",children:[]},{value:"Example",id:"example",children:[]}],c={rightToc:s};function d(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"This hook allows for defining worklet handlers that can serve in a process of handling gestures."),Object(i.b)("p",null,"Before you can use the hook, make sure that you have ",Object(i.b)("inlineCode",{parentName:"p"},"react-native-gesture-handler")," ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.swmansion.com/react-native-gesture-handler/docs/getting-started.html#installation"}),"installed and configured")," with your project."),Object(i.b)("h3",{id:"arguments"},"Arguments"),Object(i.b)("h4",{id:"gesturehandlers-object-with-worklets"},Object(i.b)("inlineCode",{parentName:"h4"},"gestureHandlers")," ","[object with worklets]"),Object(i.b)("p",null,"The first argument to this hook is an object that can carry one or more worklet handlers.\nThe handlers can be set under the following keys: ",Object(i.b)("inlineCode",{parentName:"p"},"onStart"),", ",Object(i.b)("inlineCode",{parentName:"p"},"onActive"),", ",Object(i.b)("inlineCode",{parentName:"p"},"onEnd"),", ",Object(i.b)("inlineCode",{parentName:"p"},"onFail"),", ",Object(i.b)("inlineCode",{parentName:"p"},"onCancel"),", ",Object(i.b)("inlineCode",{parentName:"p"},"onFinish"),"."),Object(i.b)("p",null,"Read more about gesture handling states in the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.swmansion.com/react-native-gesture-handler/docs/state.html"}),"Gesture Handler library documentation"),".\nEach of the specified handlers will be triggered depending on the current state of the attached Gesture Handler.\nThe handler worklet will receive the following arguments:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},Object(i.b)("inlineCode",{parentName:"p"},"event")," ","[object]"," - event object carrying the event payload.\nThe payload will be different depending on the type of the Gesture Handler to which the worklet is attached (",Object(i.b)("inlineCode",{parentName:"p"},"PanGestureHandler"),", ",Object(i.b)("inlineCode",{parentName:"p"},"RotationGestureHandler"),", etc.).\nPlease check the documentation section on the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.swmansion.com/react-native-gesture-handler/docs/getting-started.html"}),"selected handler type")," to learn about the event structure.")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},Object(i.b)("inlineCode",{parentName:"p"},"context")," ","[object]"," - plain JS object that can be used to store some state.\nThis object will persist in between events and across worklet handlers for all the selected states and you can read and write any data to it."))),Object(i.b)("h4",{id:"dependencies-array"},Object(i.b)("inlineCode",{parentName:"h4"},"dependencies")," ","[Array]"),Object(i.b)("p",null,"Optional array of values which changes cause this hook to receive updated values during rerender of the wrapping component. This matters when, for instance, worklet uses values dependent on the component's state."),Object(i.b)("p",null,"Example:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js",metastring:"{11}","{11}":!0}),"const App = () => {\n  const [state, setState] = useState(0);\n  const sv = useSharedValue(0);\n\n  const handler = useAnimatedGestureHandler(\n    {\n      onEnd: (_) => {\n        sv.value = state;\n      },\n    },\n    dependencies\n  );\n  //...\n  return <></>\n}\n")),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"dependencies")," here may be:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"undefined"),"(argument skipped) - worklet will be rebuilt if there is any change in any of the callbacks' bodies or any values from their closure(variables from outer scope used in worklet),"),Object(i.b)("li",{parentName:"ul"},"empty array(",Object(i.b)("inlineCode",{parentName:"li"},"[]"),") - worklet will be rebuilt only if any of the callbacks' bodies changes,"),Object(i.b)("li",{parentName:"ul"},"array of values(",Object(i.b)("inlineCode",{parentName:"li"},"[val1, val2, ..., valN]"),") - worklet will be rebuilt if there is any change in any of the callbacks' bodies or in any values from the given array.")),Object(i.b)("h3",{id:"returns"},"Returns"),Object(i.b)("p",null,"The hook returns a handler object that can be attached to one of the gesture handler components provided by the ",Object(i.b)("inlineCode",{parentName:"p"},"react-native-gesture-handler")," library.\nThe handler should be passed under ",Object(i.b)("inlineCode",{parentName:"p"},"onGestureEvent")," parameter regardless of what gesture states we are interested in processing."),Object(i.b)("h2",{id:"example"},"Example"),Object(i.b)("p",null,"In the below example we use ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan.html"}),Object(i.b)("inlineCode",{parentName:"a"},"PanGestureHandler"))," to register for pan gesture events performed on the rendered View.\nWe attach three handler worklets that are going to be triggered when the gesture starts, when it is active and the user is panning, and when the gesture is over.\nWe create a shared value ",Object(i.b)("inlineCode",{parentName:"p"},"x")," that will correspond to the x-translation of the box.\nIn ",Object(i.b)("inlineCode",{parentName:"p"},"onStart")," handler worklet we use ",Object(i.b)("inlineCode",{parentName:"p"},"context")," to save the current value of ",Object(i.b)("inlineCode",{parentName:"p"},"x")," and therefore remember the place at which the gesture started.\nWhen the user is panning, in ",Object(i.b)("inlineCode",{parentName:"p"},"onActive")," handler we update the translation by taking the starting point remembered in ",Object(i.b)("inlineCode",{parentName:"p"},"context")," object and adding the translation that is coming from the gesture.\nFinally, in ",Object(i.b)("inlineCode",{parentName:"p"},"onEnd")," handler we initiate an animation that'd make the box return to the initial point."),Object(i.b)("p",null,"Thanks to the ",Object(i.b)("inlineCode",{parentName:"p"},"context")," object, where we remember the initial position, the interaction can be made interruptible.\nThat is, we can continue the gesture from the place where we pick up the box, regardless of whether it is in the middle of animating back to the initial point."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import Animated, {\n  useSharedValue,\n  withSpring,\n  useAnimatedStyle,\n  useAnimatedGestureHandler,\n} from 'react-native-reanimated';\nimport { PanGestureHandler } from 'react-native-gesture-handler';\n\nfunction App() {\n  const x = useSharedValue(0);\n\n  const gestureHandler = useAnimatedGestureHandler({\n    onStart: (_, ctx) => {\n      ctx.startX = x.value;\n    },\n    onActive: (event, ctx) => {\n      x.value = ctx.startX + event.translationX;\n    },\n    onEnd: _ => {\n      x.value = withSpring(0);\n    },\n  });\n\n  const animatedStyle = useAnimatedStyle(() => {\n    return {\n      transform: [\n        {\n          translateX: x.value,\n        },\n      ],\n    };\n  });\n\n  return (\n    <PanGestureHandler onGestureEvent={gestureHandler}>\n      <Animated.View style={[styles.box, animatedStyle]} />\n    </PanGestureHandler>\n  );\n}\n")))}d.isMDXComponent=!0},300:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return h}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=r.a.createContext({}),d=function(e){var t=r.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=d(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=d(n),b=a,h=u["".concat(o,".").concat(b)]||u[b]||p[b]||i;return n?r.a.createElement(h,l(l({ref:t},c),{},{components:n})):r.a.createElement(h,l({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=b;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=n[c];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);