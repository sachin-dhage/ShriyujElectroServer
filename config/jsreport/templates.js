

// Template for Task Report
const taskReportTemplate =  async () => 
{    
    return `
        <html>
            <head>
                <style>
                    {#asset ./local-assets/taskReportStyle.css @encoding=utf8}
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </head> 
            <body>

        
                    <div class="tasks">
                        <table class="tasks-table">
                            <thead>
                                <tr >
                                    <th class="summary"  colspan="11">
                                            Task Management <br />
                                            MRK Group   <br />
                                            Date Wise Task Assignment Report    <br />
                                            Task Status
                                    </th>
                                </tr>
                                <tr>
                                    <th>Sr. No.</th> 
                                    <th>Entry Date</th> 
                                    <th>Category</th> 
                                    <th>Company</th>
                                    <th>Assigned To</th> 
                                    <th>Task / Remark</th> 
                                    <th>From Date</th> 
                                    <th>To Date</th> 
                                    <th>Department</th> 
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{#each tasks}}
                                    {{#if ISHEADER}}                            
                                        <tr  class="base-color">
                                            <td colspan="11">
                                            <strong>Date: {{ENTRYDATE_FRMT}}</strong>
                                            </td>
                                        </tr>
                                    {{else}}
                                        <tr>
                                            <td>{{SRNO}}</td>
                                            <td>{{ENTRYDATE_FRMT}}</td>
                                            <td>{{CATEGORYNAME}}</td>
                                            <td>{{COMPANYNAME}}</td>
                                            <td>{{LEDGERNAME}}</td>
                                            <td>{{TASKNAME}}</td>
                                            <td>{{FRMDATE_FRMT}}</td>
                                            <td>{{TODATE_FRMT}}</td>
                                            <td>{{GROUPNAME}}</td>
                                            <td>{{PRIORITYNAME}}</td>
                                            <td>
                                                <i class="{{iconByStatus this}}"></i>
                                                {{COMPLETE_STATUS}}
                                            </td>
                                        </tr>
                                    {{/if}}
                                {{/each}}
                            </tbody>
                            <tfoot>
                                <tr>
                                <td  class="footer" colspan="11">
                                        &copy; DISCRIMINANT TECHNOLOGIES - ALL RIGHTS RESERVED            Visit us @ www.discriminant.in
                                </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                
                <script>
                    const tasks = JSON.parse({{{getJSON tasks}}})
                    window.JSREPORT_READY_TO_START = true
                </script>        
                


            </body>
        </html>
    
    `;
}


// Export the function module
module.exports = {
    taskReportTemplate
};