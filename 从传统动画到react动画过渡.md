# 从传统动画到react动画过渡

之前放假在家的时候，群里有一个朋友问我，有没有无缝轮播的思路，百度了一下，原来无缝轮播指的是传统轮播图中最后一张轮播图下一张是第一张轮播图，不会穿过中间的轮播图。

给个例子吧

<img src="http://oymaq4uai.bkt.clouddn.com/scrollImg.gif"/>

同时放上codepen的地址
> https://codepen.io/shadowwalkerzero/pen/XqeZjQ

## 传统的思路
这是原生js实现的无缝轮播效果，给大家简单讲一下思路，以下一张为例
	
	流程是:
	假设六张图片分别为 A B C D E F
	点击下一张button
	所有图片左移 A 图片的宽度
	图片变为 B C D E F A
	
然后我们拿代码来描述一下
	
	var img0 = document.querySelector('img')[0];
	var img0Width = img0.offsetWidth,
	var imgContainer = document.querySelector('.box');    //装载图片的容器
	
	imgContainer.animate({
		marginLeft: -img0Width
		}, function(){			// 动画结束回调方法
		
			imgContainer.style.marginLeft = 0;  //将marginleft 回复到0
			var newNode = img0.cloneNode(true);  // 替换顺序
		   imgContainer.removeChild(img0);
		   imgContainer.appendChild(img0);

	})   	 
	
其实思路是很简单的，但是仔细一想这里有个不好的点，就是这句代码。

	imgContainer.style.marginLeft = 0; 

为什么说这句代码不好呢？这里是利用计算机强大的cpu，让我们可以在肉眼不可见的速度迅速右移，我们来详细模拟一下
     
     下一张：
     	假设六张图片分别为     A B C D E F
     	
     左移动画(缓动)
                         A  B C D E F
     动画回调(瞬时)
                            B C D E F A
 
 
大家有没有发现这样的动画非常不符合规律

+  我们移动了装载图片的容器造成左移，但是最后又把它瞬间右移， 不符合图片移动的**语义化**。	

## react的思路
因为我们可以明确图片的起始状态

	A B C D E ＝> B C D E A
	图片的移动描述
	(B C D E) 左移
	(A) 右移
	
也就是说我们可以明确图片的动画前后状态，而图片的顺序就是图片的移动距离。这非常符合react的设计哲学啊，好，我们拿react再写一版。
这里我们用原生js来模拟一下react，方便大家加深一下react的学习。


1.设置初始的state

		const defaultState = Array(items.length).fill(0).map((item, index) => {
	    return {
	        key: `item${index}`,
	        style: {
	            left: (index + currentNum) * 100,
	            opacity: 1
	        }
	    }
		})

这里items是img 标签的nodelist，currentNum 是表示图片初始的偏移量(-1 表示所有图片左移1张，1表示所有图片右移一张)

2.顺序改变后，更新state

			const getState = (states, moveItemKey) => states.map((state, index) => {
			    return {
			        key: state.key,
			        style: {
			            left: (index + currentNum) * 100,
			            opacity: moveItemKey === state.key ? 0 : 1
			        }
			    }
			})
			
			const setState = (newStates, moveItemKey) => {
			    return getState(newStates, moveItemKey);
			}
			
这里moveItemKey 是需要在 A B C D E ＝> B C D E A 中 的 A 图片。这里有一个问题，当A图片从第一张移动到最后一张时，A会穿过 B C D E, 这样肯定是不行的，所以我们提前拿到了A的key，把A的透明度改变成了0，这样即使穿过  B C D E，用户也无法发觉。

3.给 DOM 元素绑定key值  
	
			const setAttr = () => [...items].map((item, index) => {
		    item.setAttribute('key', states[index]['key']);
			});
		
			const render = () => {
			    [...items].map((item, index) => {
			        var key = item.getAttribute('key');
			        states.map((state, i) => {
			            if (state.key === key) {
			                item.style.left = state['style']['left'] + 'px';
			                item.style.opacity = state['style']['opacity'];
			            }
			        });
			    })
			}
这里我们把k对元素的key值 绑在了dom的属性上，render方法则会依据state的数据渲染dom。
	
4.添加上一页，下一页事件

	const prev = () => {
	    var moveItem = states.slice(states.length - 1);
	
	    newStates = [...moveItem, ...states.slice(0, states.length - 1)];
	    states = setState(newStates, moveItem[0].key);
	    render();
	}
	
	const next = () => {
	    var moveItem = states.slice(0, 1);
	
	    newStates = [...states.slice(1), ...moveItem];
	    states = setState(newStates, moveItem[0].key);
	    render();
	}
	
	prevButton.onclick = prev;
	nextButton.onclick = next;

以下一页事件(next) 为例，我们只需要把图片组中，第一张图片移至最后就可以了。这里有一点遗憾的是，没实现state变化 自动render的部分，不过这里主要是讲react的动画思路。


最后看看拿react思路改写后的效果吧 
                        
<img src="http://oymaq4uai.bkt.clouddn.com/%E8%B5%B0%E9%A9%AC%E7%81%AF.gif"/>

同时放上codepen的地址
> https://codepen.io/shadowwalkerzero/pen/rvGvjJ


相比传统的无缝轮播,拿rect的思路改写后，代码可读性变的更高，思路更加清晰，同时代码也变得更少，更容易维护。

## 官方的react-motion
当然最终的react动画方案必须是react-motion了，motion提供了各种动画参数，动画做的异常逼真，自己也按照react-motion的API，实现了一版react-motion的无缝轮播，效果如下。

<img src="http://oymaq4uai.bkt.clouddn.com/carousel.gif"/>

因为引入了react-motion，动画成本大大降低，编写的代码也十分少。这里留个地址吧，感兴趣的同学可以去看看。

[github 地址](https://github.com/FounderIsShadowWalker/carousel)

## 一点总结
现在来看动画，觉得动画都是渐进，有规律的，通过操作元素从一个位置瞬间移动到另一个位置，个人觉得是违背了动画的理念的，因为从一个位置瞬时的改变到另一个点，这样是无法描述(或者说不符合动画的语义化)，可以参照我们之前用传统方法实现的轮播。
现在我们来写动画，我们应该先把动画的状态的描述出来，然后描述把动画的起始态和结束态，这样的动画才是规律的。




