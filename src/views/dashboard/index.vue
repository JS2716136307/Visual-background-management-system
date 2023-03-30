<template>
  <div style="margin: 10px">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from '@/views/dashboard/Card'
import Sale from '@/views/dashboard/Sale'
import Observe from '@/views/dashboard/Observe'

export default {
  components: { Card, Sale, Observe },
  name: 'Dashboard'
}
</script>

<style>
</style>
