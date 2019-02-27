"use strict";

const express = require('express');
const router = require('express').Router();

router.route('/')
    .get((req, res) => {
        res.render('index.hbs');
    });

module.exports = router;