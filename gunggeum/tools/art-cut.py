# 사용: python3 tools/art-cut.py 입력.jpg 출력.webp [긴변px] [--inner 3a2f29]
# 남색 단색 바탕 중 '가장자리와 이어진' 부분만 투명하게(몸 안쪽의 남색 무늬는 남김), 가장자리 남색 번짐은 색을 빼서 정리
import sys
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage as nd
src,dst=sys.argv[1],sys.argv[2];L=int(sys.argv[3]) if len(sys.argv)>3 else 900
im=np.array(Image.open(src).convert('RGB')).astype(float);h,w,_=im.shape
edge=np.concatenate([im[:24].reshape(-1,3),im[-24:].reshape(-1,3),im[:,:24].reshape(-1,3),im[:,-24:].reshape(-1,3)])
bg=np.median(edge,0);d=np.sqrt(((im-bg)**2).sum(2))
near=d<30
lab,n=nd.label(near);border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
outside=np.isin(lab,list(border))
# 바깥과 이어진 바탕만 투명. 경계 1~2px은 부드럽게
a=np.where(outside,0.0,1.0)
# 몸 안쪽에 남은 바탕색(남색) 무늬는 진한 갈색으로 바꿔 '구멍'처럼 보이지 않게(매 꽁지 띠는 원래 짙은 갈색)
if '--inner' in sys.argv:
    inner=near&~outside; tgt=np.array([int(sys.argv[sys.argv.index('--inner')+1][i:i+2],16) for i in (0,2,4)],float)
    im[inner]=tgt+(im[inner]-bg)*0.6
soft=np.clip((d-10)/26,0,1);ring=nd.binary_dilation(outside,iterations=2)&~outside
a=np.where(ring,np.maximum(soft,0)*1.0,a)
A=Image.fromarray((a*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6))
# 가장자리 반투명 픽셀의 남색 기운 빼기(premultiplied 역산)
al=np.array(A).astype(float)/255;rgb=im.copy()
m=(al>0.02)&(al<0.98)
rgb[m]=np.clip((im[m]-bg*(1-al[m][:,None]))/al[m][:,None],0,255)
o=Image.fromarray(rgb.astype('uint8')).convert('RGBA');o.putalpha(A)
ys,xs=np.where(np.array(A)>24);pad=8
o=o.crop((max(0,xs.min()-pad),max(0,ys.min()-pad),min(w,xs.max()+pad),min(h,ys.max()+pad)))
s=L/max(o.size)
if s<1:o=o.resize((round(o.size[0]*s),round(o.size[1]*s)),Image.LANCZOS)
o.save(dst,'WEBP',quality=88,method=6);print(dst,o.size,'bg',bg.round(),'crop',xs.min()-pad,ys.min()-pad)
