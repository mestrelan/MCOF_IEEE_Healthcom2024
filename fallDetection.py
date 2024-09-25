import cv2, numpy as np, time
import angleMonitor, fallAction
from flask import Response, Flask, render_template
import requests

def create_ticket(name,camera, content, priority, department):

    #url = 'http://172.20.82.83:5000/Dispatch'
    url = 'http://192.168.47.19:5000/Dispatch'

    headers = {
        'Type':'PluginQueda'
    }

    json_ticket = {
        "name": name,
        "camera_name":camera,
        "content": content,
        "priority": priority, #1,2,3
        "department": department #3,4,5
    }

    response = requests.post(url,json=json_ticket, headers=headers)

    return "ticket criado com sucesso"
class backgroundSub:
    history = 2000
    varThresh = 64
    detectShadows = True
    kernel = np.ones((3,3),np.uint8)
    curFrame = 0

    def MOG(self):
        cap = cap = cv2.VideoCapture('S003C001P008R002A043_rgb.avi')
        #fgbg = cv2.createBackgroundSubtractorMOG2(self.history, self.varThresh ,self.detectShadows)
        fgbg = cv2.createBackgroundSubtractorKNN(history=5000)
        cont_queda = 0
        cont15 = 0
        ticket_enviado=False
        video_out = False
        if video_out:
            VIDEO_OUT = 'salvo.avi'
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            writer = cv2.VideoWriter(VIDEO_OUT, fourcc, 25, (900, 520), True)#True para video colorido
        
        while(cap != None):
            if (self.curFrame % 1 == 0):
                ret, frame = cap.read()
                frame=cv2.resize(frame,(960,540))
                #print(frame.shape)
                #frame=frame[0:520,0:900]
                #frame=frame[190:,0:]
                #print(frame.shape)

                fgmask = fgbg.apply(frame,0)
                bgrThresh = fgmask
                _, bgrThresh = cv2.threshold(fgmask,254,255,cv2.THRESH_BINARY)

                bgrThresh = cv2.erode(bgrThresh,self.kernel, iterations = 2)
                bgrThresh = cv2.morphologyEx(bgrThresh, cv2.MORPH_OPEN, self.kernel, iterations = 2)
                bgrThresh = cv2.morphologyEx(bgrThresh, cv2.MORPH_CLOSE, self.kernel, iterations = 2)
                bgrThresh = cv2.dilate(bgrThresh,self.kernel, iterations = 10)
                bgrThresh = cv2.morphologyEx(bgrThresh, cv2.MORPH_OPEN, self.kernel, iterations = 2)
        
                if cv2.countNonZero(bgrThresh) > 0:
                    queda,FinalFrame = fall.check(det.Detect(bgrThresh, self.curFrame, frame))
                    if queda == 1:
                        cont_queda+=1
                        #print(cont_queda)
                        if cont_queda ==3:
                            org = [0, 200]
                            font = cv2.FONT_HERSHEY_SIMPLEX
                            fontScale = 5
                            color = (255, 0, 0)
                            thickness = 7
                            cv2.putText(FinalFrame, 'Queda!', org, font, fontScale, color, thickness)
                            if ticket_enviado==False:
                                print('criando ticket queda')
                                #create_ticket('Visao Comp.',"Lab",'Queda', 1, 1)
                                ticket_enviado=True
                self.curFrame += 1

                cont15 +=1
                if cont15 == 16:
                    cont15=1
                    cont_queda=0
                cv2.imshow("Fall Detection", FinalFrame)
                if video_out == True:
                    try:
                        writer.write(frame)
                    except:
                        pass
                k = cv2.waitKey(30) & 0xff
                if k == 27:
                    break
                
                #time.sleep(0.033)

        cap.release()
        cv2.destroyAllWindows()
        return 0

bgRemove = backgroundSub()
fall = fallAction.fallAction()

det = angleMonitor.angleMonitor()

bgRemove.MOG()