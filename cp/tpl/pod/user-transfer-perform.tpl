<div id="incp-pod-user-transfer-perform-alert"></div>

<div id="incp-pod-user-transfer-perform">  

<table class="incp-formtable" width="100%">
<thead class="incp-formtable-tr-line">
  <tr>
    <th>Pod ID</th>
    <th>Name</th>
    <th>From</th>
    <th></th>
  </tr>
</thead>
<tbody>
{[~it.items :v]} 
<tr>
  <td>{[=v.id]}</td>
  <td>{[=v.name]}</td>
  <td>{[=v.user_from]}</td>
  <td>
    <input type="checkbox" name="user_transfer_pod_id" value="{[=v.id]}" class="iform-check-input" checked>
  </td>
</tr>
{[~]}
</tbody>
</table>

</div>
