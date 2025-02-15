import { Controller } from 'stimulus';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import Rails from '@rails/ujs';


export default class extends Controller {
  static targets =  ["done_value","bar","doughnut","delay_task"]
  connect(){
    const doughnut_data =[this.element.dataset.taskDone,this.element.dataset.taskDoing]
    const projectID = this.element.dataset.projectId;
    Rails.ajax({
      url: `/api/v1/projects/${projectID}/chart`,
      type: 'get',
      success: (resp) => {
        console.log(resp);
        const label = resp[0].map(element => {
          return element.username
        });
        this.barChart(label,resp[1])
      },
      error: (err) => {
      },
    });
    this.doughnutCart(doughnut_data)
    
  }
  barChart(labels,data){
    new Chart(this.barTarget, {
      // 參數設定[註1]
      type: "bar", // 圖表類型
      data: {
        labels: labels, // 標題
        datasets: [{
          label: "任務數量", // 標籤
          data: data, // 資料
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1 // 外框寬度
        }]
      }
    });
  }
  doughnutCart(data){
    new Chart(this.doughnutTarget, {
      // 參數設定[註1]
      type: "doughnut", // 圖表類型
      data: {
        labels: ["完成","代辦事項"], // 標題
        datasets: [{
          data: data, // 資料
          backgroundColor: [
            'rgb(141, 132, 232)',
            'rgb(231, 226, 250)',
          ],
          borderWidth: 1 // 外框寬度
        }]
      }
    });
  }
  show_delay(){
    this.delay_taskTarget.style.display = "block"
  }
  close_delay(){
    this.delay_taskTarget.style.display = "none"
  }
}
