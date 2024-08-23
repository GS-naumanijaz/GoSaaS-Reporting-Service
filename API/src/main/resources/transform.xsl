<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:template match="/">
       <html>
           <head>
               <title>User Reports</title>
               <style>
                   table {
                       width: 100%;
                       border-collapse: collapse;
                   }
                   th, td {
                       border: 1px solid black;
                       padding: 8px;
                       text-align: left;
                   }
                   th {
                       background-color: #f2f2f2;
                   }
               </style>
           </head>
           <body>
               <h1>User Reports</h1>
               <table>
                   <tr>
                       <th>Trainee First Name</th>
                       <th>Trainee Last Name</th>
                       <th>Supervisor First Name</th>
                       <th>Supervisor Last Name</th>
                       <th>Course Code</th>
                       <th>Course Name</th>
                       <th>Revision Number</th>
                       <th>Instance Title</th>
                       <th>Start Date</th>
                       <th>Due Date</th>
                       <th>Status</th>
                   </tr>
                   <xsl:for-each select="/UserReports/Report">
                       <tr>
                           <td><xsl:value-of select="trainee_first_name"/></td>
                           <td><xsl:value-of select="trainee_last_name"/></td>
                           <td><xsl:value-of select="supervisor_first_name"/></td>
                           <td><xsl:value-of select="supervisor_last_name"/></td>
                           <td><xsl:value-of select="course_code"/></td>
                           <td><xsl:value-of select="course_name"/></td>
                           <td><xsl:value-of select="revision_number"/></td>
                           <td><xsl:value-of select="instance_title"/></td>
                           <td><xsl:value-of select="start_date"/></td>
                           <td><xsl:value-of select="due_date"/></td>
                           <td><xsl:value-of select="status"/></td>
                       </tr>
                   </xsl:for-each>
               </table>
           </body>
       </html>
   </xsl:template>
</xsl:stylesheet>
