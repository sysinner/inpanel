<div id="incp-resdomain-boundlist-alert"></div>

<div id="incp-resdomain-boundlist"></div>

<script type="text/html" id="incp-resdomain-boundlist-tpl">
<input type="hidden" name="meta_name" value="{[=it.meta.name]}">
<table class="table table-hover">
<thead>
<tr>
  <th>Path</th>
  <th>Type</th>
  <th>Setting</th>
  <th>Action</th>
  <th></th>
</tr>
</thead>
<tbody>
{[~it.bounds :v]}
<tr>
  <td class="incp-font-fixspace">{[=v._name]}</td>
  <td>
    {[~it._types :tv]}
    {[if (v._type == tv.type) {]}{[=tv.title]}{[}]}
    {[~]}
  </td>
  <td class="incp-font-fixspace">{[=v._value]}</td>
  <td>
    {[~it._actions :av]}
    {[if (v.action == av.action) {]}{[=av.title]}{[}]}
    {[~]}
  </td>
  <td align="right">
    <button class="incp-btn incp-btn-xsmall" onclick="inCpResDomain.BoundSet('{[=v.name]}')">Setting</button>
  </td>
</tr>
{[~]}
</tbody>
</table>
</script>

