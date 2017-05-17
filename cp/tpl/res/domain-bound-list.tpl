<div id="loscp-resdomain-boundlist-alert"></div>

<div id="loscp-resdomain-boundlist"></div>

<script type="text/html" id="loscp-resdomain-boundlist-tpl">
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
  <td class="loscp-font-fixspace">{[=v._name]}</td>
  <td>
    {[~it._types :tv]}
    {[if (v._type == tv.type) {]}{[=tv.title]}{[}]}
    {[~]}
  </td>
  <td class="loscp-font-fixspace">{[=v._value]}</td>
  <td>
    {[~it._actions :av]}
    {[if (v.action == av.action) {]}{[=av.title]}{[}]}
    {[~]}
  </td>
  <td align="right">
    <button class="loscp-btn loscp-btn-xsmall" onclick="losCpResDomain.BoundSet('{[=v.name]}')">Setting</button>
  </td>
</tr>
{[~]}
</tbody>
</table>
</script>

