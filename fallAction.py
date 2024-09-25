import cv2, numpy as np, collections

class fallAction:
    init = False
    detectedAngles = collections.deque(5*[0], 5)

    def check(self, angle):
        if not self.init:
            
            self.detectedAngles.appendleft(angle[0])
        try:    
            if all(i >= 70 for i in self.detectedAngles) and all(i <= 100 for i in self.detectedAngles):
                #print("Fall Detected!!!")
                #create_ticket('Queda', 'Visao Comp.', 3, 5)
                return 1,angle[1]
            return 0,angle[1]

        except:
            return 0,angle[1]
            